# National Internship & Placement Mission Portal
## Smart India Hackathon (SIH) 2025 - Complete Solution Report

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [System Architecture](#4-system-architecture)
5. [Technology Stack](#5-technology-stack)
6. [User Roles & Workflows](#6-user-roles--workflows)
7. [Key Features](#7-key-features)
8. [AI/ML Recommendation Engine](#8-aiml-recommendation-engine)
9. [Database Design](#9-database-design)
10. [API Architecture](#10-api-architecture)
11. [Security & Authentication](#11-security--authentication)
12. [Deployment](#12-deployment)
13. [Future Enhancements](#13-future-enhancements)
14. [Conclusion](#14-conclusion)

---

## 1. Executive Summary

The **National Internship & Placement Mission Portal** is a comprehensive, full-stack web application designed to streamline and unify the internship and placement process across Indian higher-education institutions. The platform connects four key stakeholders — **Students**, **Faculty Mentors**, **Placement Cells**, and **Employers** — on a single, secure, and intelligent platform.

### Key Highlights:
- **280+ institutions** can be onboarded
- **4,800+ opportunities** can be hosted
- **1,80,000+ students** supported
- **Deployed at**: https://sih25-one.vercel.app/

---

## 2. Problem Statement

### Current Challenges in Campus Placements:

1. **Fragmented Systems**: Each institution operates independently with disparate tools
2. **Lack of Transparency**: Students lack visibility into end-to-end placement processes
3. **Manual Verification**: Certificate and credential verification is time-consuming
4. **Inefficient Matching**: Students often miss relevant opportunities due to poor matching
5. **Limited Analytics**: Placement cells lack real-time data for decision-making
6. **No Unified Communication**: Multiple channels create confusion

### Need for a Unified Solution:
A centralized platform that provides fair access, verified outcomes, and measurable impact for all stakeholders involved in the placement ecosystem.

---

## 3. Solution Overview

Our solution provides a **Centralized Role-Based Portal** with three core pillars:

### 3.1 Unified Roles
- Single digital profiles for all stakeholders
- One-click application for students
- Calendar-safe scheduling for interviews
- Real-time conversion dashboards

### 3.2 Blockchain-Verified Trust
- Certificates and feedback hashed on permissioned blockchain
- Tamper-proof & QR-verifiable credentials
- Sensitive data stays off-chain ensuring privacy

### 3.3 AI & Hybrid Recommendation
- Smart matching using XGBoost + Random Forest & Collaborative Filtering
- Adaptive learning with smart notifications (Reinforcement Learning)
- SHAP-based fairness insights for unbiased selection

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              Next.js 15 Frontend (React 19)                      │   │
│  │  • Landing Pages  • Dashboards  • Application UI  • Analytics    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                                │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    Next.js API Routes                          │    │
│  │  /api/student  /api/employer  /api/faculty  /api/placementcell │    │
│  │  /api/interview  /api/notification  /api/recommendation-engine │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                │                                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    NextAuth.js v5                              │    │
│  │         JWT-based Authentication & Session Management          │    │
│  └────────────────────────────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
         ┌──────────────────────┴──────────────────────┐
         │                                             │
         ▼                                             ▼
┌─────────────────────────────┐     ┌─────────────────────────────────────┐
│       DATA LAYER            │     │    AI/ML SERVICE LAYER              │
│  ┌────────────────────┐    │     │  ┌────────────────────────────────┐ │
│  │  PostgreSQL DB     │    │     │  │  FastAPI Recommendation Engine │ │
│  │  (Prisma ORM)      │    │     │  │  • Sentence Transformers       │ │
│  │                    │    │     │  │  • Skill-based Matching        │ │
│  │  • Students        │    │     │  │  • Department Filtering        │ │
│  │  • Companies       │    │     │  │  • pgvector for Vector Search  │ │
│  │  • Opportunities   │    │     │  └────────────────────────────────┘ │
│  │  • Applications    │    │     │                                     │
│  │  • Interviews      │    │     │  ┌────────────────────────────────┐ │
│  │  • Certificates    │    │     │  │  HuggingFace Inference API     │ │
│  └────────────────────┘    │     │  │  (all-MiniLM-L6-v2 model)      │ │
│                            │     │  └────────────────────────────────┘ │
│  ┌────────────────────┐    │     └─────────────────────────────────────┘
│  │  Cloudinary        │    │
│  │  (File Storage)    │    │
│  └────────────────────┘    │
└─────────────────────────────┘
```

---

## 5. Technology Stack

### 5.1 Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI component library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Radix UI** | Accessible UI primitives |
| **Recharts** | Data visualization charts |
| **Lucide React** | Icons library |

### 5.2 Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | RESTful API endpoints |
| **NextAuth.js v5** | Authentication & authorization |
| **Prisma ORM** | Database access layer |
| **Axios** | HTTP client |

### 5.3 Database
| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary relational database |
| **pgvector** | Vector similarity search extension |

### 5.4 AI/ML Services
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python ML API framework |
| **Sentence Transformers** | Semantic text embeddings |
| **HuggingFace API** | Model inference service |

### 5.5 External Services
| Technology | Purpose |
|------------|---------|
| **Cloudinary** | Image/file upload & storage |
| **Mailtrap** | Email delivery service |
| **Vercel** | Frontend deployment |
| **Docker** | Containerization |

---

## 6. User Roles & Workflows

### 6.1 Students

**Capabilities:**
- Create and manage digital profile (skills, projects, certifications)
- Upload multiple resumes
- Browse and apply for opportunities
- Track application status
- View AI-powered job recommendations
- Attend scheduled interviews
- Access placement progress analytics

**Workflow:**
```
Sign Up → Complete Profile → Get Recommendations → Apply → 
Mentor Approval → Interview → Selection → Offer
```

### 6.2 Faculty / Mentors

**Capabilities:**
- View assigned mentee students
- Review and approve/reject student applications
- Add mentor remarks and guidance
- Track student placement progress
- View departmental analytics

**Workflow:**
```
Review Pending Approvals → Evaluate Application → 
Add Remarks → Approve/Reject → Monitor Progress
```

### 6.3 Placement Cell

**Capabilities:**
- Manage institution-wide placements
- Approve company registration requests
- View comprehensive analytics dashboards
- Monitor placement rates and statistics
- Manage employer relationships
- Generate reports

**Workflow:**
```
Company Onboarding → Opportunity Approval → 
Drive Management → Analytics Review → Reporting
```

### 6.4 Employers

**Capabilities:**
- Register company (requires approval)
- Post job/internship opportunities
- View matched student recommendations
- Review applications
- Schedule and conduct interviews
- Manage hiring pipeline
- Provide feedback and certificates

**Workflow:**
```
Company Registration → Approval → Post Opportunity → 
Review Applications → Schedule Interviews → 
Evaluate → Offer → Onboard Interns
```

---

## 7. Key Features

### 7.1 Dashboard Analytics

Each user role has a personalized dashboard:

| Role | Dashboard Features |
|------|-------------------|
| **Student** | Profile completeness, CGPA, applications count, upcoming interviews, recent opportunities |
| **Faculty** | Students under guidance, pending approvals, placement rate, interview schedules |
| **Placement Cell** | Active jobs, total students, partner companies, placement rate, top recruiters, activity feed |
| **Employer** | Active jobs, total applications, interviews scheduled, offers made, hiring pipeline |

### 7.2 Application Lifecycle

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────┐
│ mentor_approval │ ──▶ │     applied      │ ──▶ │   reviewed    │
│     _needed     │     │                  │     │               │
└─────────────────┘     └──────────────────┘     └───────────────┘
                                                        │
                        ┌───────────────────────────────┘
                        ▼
              ┌───────────────┐            ┌───────────────┐
              │  shortlisted  │ ────────▶  │   accepted    │
              │               │            │               │
              └───────────────┘            └───────────────┘
                        │
                        ▼
              ┌───────────────┐
              │   rejected    │
              │               │
              └───────────────┘
```

### 7.3 Interview Management

- **Scheduling**: Employers schedule interviews with date, time, and meeting link
- **Notifications**: Automated email and in-app notifications
- **Status Tracking**: Scheduled → Completed → Accepted/Rejected/Canceled

### 7.4 Company Onboarding

- Companies register with details (name, description, industry, location)
- Placement cell reviews registration requests
- Upon approval, company is created and employer account activated
- Review notes and status tracking for transparency

### 7.5 Notification System

**Notification Types:**
- `interview_scheduled` - Interview scheduled notification
- `internship_offer` - Internship/job offer
- `new_opportunity` - New job matching student profile
- `new_application` - Application received (for employers)
- `application_rejected` - Application status update
- `new_approval` - Approval request for faculty
- `approval_rejected` - Mentor rejected application
- `approval_accepted` - Mentor approved application

### 7.6 Feedback & Certificates

- Students can submit feedback during/after internships
- Employers can provide performance reviews
- Digital certificates issued and stored with URL links

---

## 8. AI/ML Recommendation Engine

### 8.1 Architecture

The recommendation engine is a standalone **FastAPI** microservice that provides intelligent job-student matching.

```
┌─────────────────────────────────────────────────────────────┐
│                 Recommendation Engine API                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ FastAPI     │  │ Routes      │  │ Pydantic Schemas    │  │
│  │ Server      │──│ /api/*      │──│ Validation          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Core Recommendation Engine              │   │
│  │  ┌───────────────┐  ┌───────────────────────────┐   │   │
│  │  │ Sentence      │  │ Scoring Components        │   │   │
│  │  │ Transformers  │  │ - Vector Similarity: 40%  │   │   │
│  │  │ (Embeddings)  │  │ - Skill Match: 35%        │   │   │
│  │  └───────────────┘  │ - Department Match: 15%   │   │   │
│  │                     │ - Requirement Match: 10%  │   │   │
│  │                     └───────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Matching Algorithm

**Hybrid Scoring Approach:**

| Factor | Weight | Description |
|--------|--------|-------------|
| **Vector Similarity** | 40% | Semantic similarity using sentence embeddings (`all-MiniLM-L6-v2`) |
| **Skill Match** | 35% | Jaccard similarity between student skills and job requirements |
| **Department Match** | 15% | Checks if student's branch matches eligible departments |
| **Requirement Match** | 10% | Additional requirements and CGPA criteria |

### 8.3 Features

- **Semantic Matching**: Uses sentence transformers for deep text understanding
- **Skill-based Matching**: Calculates skill overlap between user and job
- **Department Eligibility**: Filters jobs based on eligible departments
- **Batch Filtering**: Considers graduation year for internship vs full-time
- **Real-time Updates**: Dynamically add, update, or remove jobs
- **Persistence**: PostgreSQL with pgvector for vector storage

### 8.4 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recommendations` | POST | Get personalized job recommendations |
| `/api/jobs` | POST | Add new job opportunity |
| `/api/jobs/bulk` | POST | Bulk add job opportunities |
| `/api/students` | POST | Add student profile for matching |
| `/api/health` | GET | Health check endpoint |

---

## 9. Database Design

### 9.1 Entity Relationship Overview

```
┌─────────────────┐        ┌─────────────────┐
│   PlacmentCell  │───────▶│ CompanyRequest  │
└─────────────────┘        └─────────────────┘
                                   │
                                   ▼
┌─────────────────┐        ┌─────────────────┐
│    Faculty      │        │     Company     │
└─────────────────┘        └─────────────────┘
        │                          │
        │ mentees                  │ employees
        ▼                          ▼
┌─────────────────┐        ┌─────────────────┐
│    Student      │        │    Employer     │
└─────────────────┘        └─────────────────┘
        │                          │
        │                          │ posts
        │                          ▼
        │                  ┌─────────────────┐
        │                  │  Opportunity    │
        │                  └─────────────────┘
        │                          │
        └──────────┬───────────────┘
                   ▼
           ┌─────────────────┐
           │   Application   │
           └─────────────────┘
                   │
                   ├────────▶ Interview
                   │
                   └────────▶ Internship ────▶ Certificate
                                    │
                                    └────────▶ Feedback
```

### 9.2 Key Models

| Model | Description |
|-------|-------------|
| **Student** | Student profiles with skills, projects, certifications |
| **Faculty** | Faculty/mentors who guide students |
| **PlacementCell** | Institution placement administrators |
| **Company** | Employer organizations |
| **Employer** | Individual company employees who post jobs |
| **Opportunity** | Job/internship postings |
| **Application** | Student applications to opportunities |
| **Interview** | Scheduled interviews |
| **Internship** | Confirmed internship records |
| **Certificate** | Digital certificates |
| **Resume** | Student resume uploads |
| **Notification** | In-app notifications |
| **Feedback** | Student feedback on internships |
| **MatchedStudent** | AI-matched students for opportunities |

### 9.3 Key Enums

```typescript
enum Status {
  draft, active, closed, rejected
}

enum ApplicationStatus {
  mentor_approval_needed, applied, reviewed,
  shortlisted, rejected, accepted
}

enum InterviewStatus {
  scheduled, completed, accepted, rejected, canceled
}

enum NotificationType {
  interview_scheduled, internship_offer, new_opportunity,
  new_application, application_rejected, new_approval,
  approval_rejected, approval_accepted
}
```

---

## 10. API Architecture

### 10.1 API Routes Structure

```
/api
├── /auth                    # NextAuth handlers
├── /sign-up                 # User registration
│   ├── /student
│   ├── /faculty
│   └── /employer
├── /student                 # Student APIs
│   ├── /dashboard-stats
│   ├── /profile
│   ├── /applications
│   └── /recommendations
├── /employer                # Employer APIs
│   ├── /dashboard
│   ├── /get-company-opportunities
│   ├── /get-applied-students
│   └── /post-opportunity
├── /faculty                 # Faculty APIs
│   ├── /approvals
│   └── /students
├── /placementcell           # Placement Cell APIs
│   ├── /dashboard
│   ├── /students
│   └── /analytics
├── /company-requests        # Company registration
├── /interview               # Interview management
├── /notification            # Notification APIs
├── /recommendation-engine   # ML engine sync
│   ├── /add-jobs
│   └── /add-students
├── /email                   # Email services
└── /upload                  # File upload (Cloudinary)
```

### 10.2 Sample API Response

```json
// GET /api/student/dashboard-stats
{
  "student": {
    "cgpa": 8.5,
    "placed": false
  },
  "profileCompleteness": 78,
  "stats": {
    "totalApplications": 12,
    "scheduledInterviewsCount": 3
  },
  "upcomingInterviews": [...],
  "recentOpportunities": [...]
}
```

---

## 11. Security & Authentication

### 11.1 Authentication Flow

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────┐
│  User   │────▶│  Sign In    │────▶│   NextAuth   │────▶│  Prisma  │
│         │     │  Form       │     │  Credentials │     │  Query   │
└─────────┘     └─────────────┘     └──────────────┘     └──────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  JWT Token   │
                                    │  (20 min)    │
                                    └──────────────┘
```

### 11.2 Security Features

| Feature | Implementation |
|---------|---------------|
| **Role-based Access** | 4 distinct roles with specific permissions |
| **JWT Sessions** | 20-minute expiry for enhanced security |
| **Credential Validation** | Server-side email/password verification |
| **Protected Routes** | Middleware-based route protection |
| **CORS Configuration** | Configured for frontend-backend communication |

### 11.3 User Roles

```typescript
type UserRole = "student" | "placement-cell" | "employer" | "faculty"
```

---

## 12. Deployment

### 12.1 Frontend Deployment

- **Platform**: Vercel
- **URL**: https://sih25-one.vercel.app/
- **Build**: `next build --turbopack`

### 12.2 Database

- **Provider**: PostgreSQL (cloud-hosted)
- **ORM**: Prisma with generated client

### 12.3 Recommendation Engine

- **Containerization**: Docker
- **Framework**: FastAPI with Uvicorn
- **Model**: HuggingFace Inference API

### 12.4 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
AUTH_SECRET="..."

# External Services
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
MAILTRAP_TOKEN="..."

# Recommendation Engine
RECOMMENDATION_API_URL="http://localhost:8000"
HUGGINGFACE_API_KEY="..."
```

---

## 13. Future Enhancements

### 13.1 Planned Features

1. **Blockchain Integration**
   - Implement permissioned blockchain for certificate verification
   - QR-verifiable credentials

2. **Advanced Analytics**
   - Predictive placement analytics
   - Skill gap analysis reports
   - Industry trend insights

3. **Mobile Application**
   - React Native / Flutter app
   - Push notifications
   - Offline application drafts

4. **Enhanced AI Features**
   - Resume parsing and skill extraction
   - Interview preparation chatbot
   - Salary prediction models

5. **Integration APIs**
   - LinkedIn profile import
   - GitHub activity analysis
   - Multiple LMS integrations

### 13.2 Scalability Considerations

- Microservices architecture for recommendation engine
- Redis caching for frequently accessed data
- CDN for static assets
- Database read replicas for analytics queries

---

## 14. Conclusion

The **National Internship & Placement Mission Portal** provides a comprehensive, secure, and intelligent solution for managing campus placements across Indian higher-education institutions. The platform successfully addresses the key challenges in the current placement ecosystem by:

✅ **Unifying** all stakeholders on a single platform  
✅ **Automating** workflows and reducing manual overhead  
✅ **Providing AI-powered** recommendations for better matching  
✅ **Ensuring transparency** through real-time tracking and analytics  
✅ **Enabling scalability** for nationwide deployment  

The solution aligns with the government's Digital India initiative and can significantly improve placement outcomes for millions of students across the country.

---

## Appendix

### A. Project Structure

```
sih25/
├── app/                    # Next.js App Router
│   ├── (app)/              # Protected application routes
│   ├── (landings)/         # Public landing pages
│   ├── api/                # API routes
│   └── sign-in/            # Authentication pages
├── components/             # React components
├── contexts/               # React contexts
├── lib/                    # Utilities and types
├── prisma/                 # Database schema
├── public/                 # Static assets
└── recommendation-engine/  # Python ML service
```

### B. Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Start development servers
npm run dev          # Next.js frontend
npm run dev:engine   # Recommendation engine
npm run dev:all      # Both concurrently
```

### C. Contact

For technical support or queries:
- **Helpline**: +91 011 4000 1122
- **Email**: support@placement.gov.in
- **Hours**: Mon–Sat, 9:00 – 18:00

---

*Document Version: 1.0*  
*Last Updated: March 2026*  
*Smart India Hackathon (SIH) 2025 Submission*
