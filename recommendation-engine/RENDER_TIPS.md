# Keep-Alive and Sync Utilities for Render Deployment

## Handling Render's Free Tier Sleep

### Option 1: Frontend Loading State

Handle the 30-second wake-up gracefully in your Next.js app:

```typescript
// lib/api/recommendation-engine.ts
import axios from 'axios';

const engineClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_RECOMMENDATION_ENGINE_URL,
    timeout: 35000, // 35 seconds to account for cold start
});

// Add request interceptor for better error handling
engineClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            throw new Error('Service is waking up, please try again in a moment...');
        }
        throw error;
    }
);

export default engineClient;
```

### Option 2: Auto Keep-Alive Script

Run this in your Next.js app (server-side):

```typescript
// app/api/cron/keep-alive/route.ts
// Call this from Vercel Cron or external service

export async function GET() {
    try {
        const response = await fetch(
            `${process.env.RECOMMENDATION_ENGINE_URL}/health`,
            { next: { revalidate: 0 } }
        );
        
        return Response.json({ 
            success: true, 
            status: await response.json() 
        });
    } catch (error) {
        return Response.json({ 
            success: false, 
            error: 'Failed to ping recommendation engine' 
        }, { status: 500 });
    }
}
```

Then set up a cron job at [cron-job.org](https://cron-job.org):
- URL: `https://your-nextjs-app.vercel.app/api/cron/keep-alive`
- Interval: Every 10 minutes
- This keeps your Render service awake!

---

## Auto-Sync Jobs on Render Restart

### Create Sync Endpoint

```typescript
// app/api/admin/sync-recommendation-engine/route.ts
import { prisma } from '@/lib/prisma';
import axios from 'axios';

export async function POST() {
    try {
        // Fetch all active jobs from database
        const jobs = await prisma.opportunity.findMany({
            where: { status: "active" },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                location: true,
                status: true,
                salary: true,
                requirements: true,
                eligibleDepartments: true,
                skillsRequired: true,
                additionalInfo: true
            }
        });

        // Sync to recommendation engine
        const response = await axios.post(
            `${process.env.RECOMMENDATION_ENGINE_URL}/jobs/add_bulk`,
            { jobs },
            { timeout: 60000 } // 60 second timeout
        );

        return Response.json({
            success: true,
            synced: response.data.added_count,
            skipped: response.data.skipped_count,
            total: jobs.length
        });
    } catch (error) {
        console.error('Sync failed:', error);
        return Response.json(
            { success: false, error: 'Sync failed' },
            { status: 500 }
        );
    }
}
```

### Auto-Sync on First Request

Add this to your recommendation route:

```typescript
// app/api/student/get-recommendations/route.ts
import { prisma } from '@/lib/prisma';
import axios from 'axios';

let engineReady = false;

async function ensureEngineReady() {
    if (engineReady) return;
    
    try {
        // Check if engine has jobs
        const stats = await axios.get(
            `${process.env.RECOMMENDATION_ENGINE_URL}/jobs/stats`,
            { timeout: 35000 }
        );
        
        if (stats.data.total_jobs === 0) {
            // Engine is empty, sync all jobs
            await axios.post(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/sync-recommendation-engine`
            );
        }
        
        engineReady = true;
    } catch (error) {
        console.error('Failed to ensure engine ready:', error);
    }
}

export async function POST(req: Request) {
    // Ensure engine is ready before processing
    await ensureEngineReady();
    
    // ... rest of your recommendation logic
}
```

---

## Vercel Cron Integration (For Pro Users)

If you have Vercel Pro, use built-in crons:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

---

## Testing Cold Start Locally

Simulate Render's behavior:

```bash
# Stop your local server for 30 seconds
# Then make a request

curl -w "\nTime: %{time_total}s\n" \
  https://your-app.onrender.com/health
```

---

## Production Checklist

- [ ] Deploy to Render
- [ ] Set up external cron for keep-alive
- [ ] Add sync endpoint in Next.js
- [ ] Test cold start behavior
- [ ] Add loading states in frontend
- [ ] Set proper timeouts (35s+)
- [ ] Monitor Render logs for issues
