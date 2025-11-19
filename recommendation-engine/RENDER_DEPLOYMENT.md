# Deploy Recommendation Engine to Render.com

## Why Render?

✅ **Truly Free**: 750 hours/month (enough for 24/7 operation)  
✅ **No Credit Card Required**: Start immediately  
✅ **Auto-Deploy**: Connects to GitHub for automatic deployments  
✅ **Python-Friendly**: Great for FastAPI applications  
⚠️ **Note**: Free tier services spin down after 15 minutes of inactivity (wake time: ~30 seconds)

---

## Deployment Steps

### Method 1: Dashboard Deployment (Easiest)

1. **Go to [Render.com](https://render.com)** and sign up (use GitHub login)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `sih25` repository

3. **Configure the Service**
   - **Name**: `recommendation-engine` (or any name you like)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `recommendation-engine`
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python init_db.py
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

4. **Select Free Plan**
   - Instance Type: **Free**
   - Click "Create Web Service"

5. **Wait for Deployment**
   - First deployment takes 2-5 minutes
   - Watch the logs in real-time
   - You'll get a URL like: `https://recommendation-engine-xxxx.onrender.com`

6. **Test Your Deployment**
   ```bash
   curl https://your-app.onrender.com/health
   # Should return: {"status":"ok"}
   ```

---

### Method 2: Using render.yaml (Infrastructure as Code)

If you prefer automated deployment:

1. The `render.yaml` file is already created in your project
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect your repository
4. Render will auto-detect the `render.yaml` and set everything up

---

## Important: Handling Free Tier Sleep

On the free tier, your service **spins down after 15 minutes** of inactivity and takes ~30 seconds to wake up.

### Solutions:

#### Option 1: Keep-Alive Ping (Simple)
Add this to your Next.js app to keep it awake:

```typescript
// lib/keep-alive.ts
export function startKeepAlive() {
    if (process.env.NODE_ENV === 'production') {
        // Ping every 10 minutes to keep awake
        setInterval(async () => {
            try {
                await fetch(`${process.env.RECOMMENDATION_ENGINE_URL}/health`)
            } catch (error) {
                console.error('Keep-alive ping failed:', error)
            }
        }, 10 * 60 * 1000) // 10 minutes
    }
}
```

#### Option 2: External Cron Service (Better)
Use a free cron service to ping your API:

1. Go to [cron-job.org](https://cron-job.org) (free)
2. Create a job to hit `https://your-app.onrender.com/health` every 10 minutes
3. Your API stays awake 24/7!

#### Option 3: Accept the Sleep (Simplest)
- First request after inactivity takes ~30 seconds
- Subsequent requests are instant
- Good enough for low-traffic apps

---

## Persistent Storage

Render's free tier has **ephemeral storage** (resets on deploy/restart).

### Solution: Rebuild Index on Startup

Add this endpoint to rebuild the index from your database:

```python
# In app/routes/jobs.py
@router.post("/rebuild_index")
async def rebuild_index():
    """Rebuild the entire job index from external source"""
    # Call this endpoint from your Next.js app after Render restarts
    # Your Next.js app can trigger this with all jobs from database
    pass
```

Then in your Next.js app, detect when Render restarts and auto-sync:

```typescript
// lib/sync-jobs.ts
export async function syncJobsToEngine() {
    const jobs = await prisma.opportunity.findMany({
        where: { status: "active" }
    });
    
    await axios.post(
        `${process.env.RECOMMENDATION_ENGINE_URL}/jobs/add_bulk`,
        { 
            jobs: jobs.map(job => ({
                id: job.id,
                title: job.title,
                description: job.description,
                type: job.type,
                location: job.location,
                status: job.status,
                salary: job.salary,
                requirements: job.requirements,
                eligibleDepartments: job.eligibleDepartments,
                skillsRequired: job.skillsRequired,
                additionalInfo: job.additionalInfo
            }))
        }
    );
}
```

---

## Update Your Next.js Environment

After deployment, update `.env.local`:

```bash
RECOMMENDATION_ENGINE_URL=https://your-app-name.onrender.com
```

---

## Alternative: Vercel Serverless (If Render doesn't work)

If you want zero cold starts and use Vercel:

1. Convert the FastAPI app to Vercel serverless functions
2. Requires restructuring but stays on Vercel (your Next.js host)
3. I can help with this if needed!

---

## Cost Comparison

| Platform | Free Tier | Sleep? | Limitations |
|----------|-----------|--------|-------------|
| **Render** | 750hrs/month | Yes (15min) | Ephemeral storage |
| Fly.io | 3 VMs | No | 256MB RAM each |
| Railway | $5 credits | No | Credits run out |
| Vercel | Unlimited | No | Serverless only |
| PythonAnywhere | Limited | No | 100s CPU/day |

**Verdict**: Render is the best balance of free + easy for your use case!

---

## Quick Start Checklist

- [ ] Sign up on Render.com
- [ ] Create new Web Service from GitHub
- [ ] Set root directory to `recommendation-engine`
- [ ] Configure build and start commands
- [ ] Select Free plan
- [ ] Deploy and get URL
- [ ] Update Next.js `.env.local`
- [ ] Set up cron job for keep-alive (optional)
- [ ] Test all endpoints

You're all set! 🚀
