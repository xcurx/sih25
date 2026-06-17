# National Internship & Placement Mission Portal

### Smart India Hackathon (SIH) 2025 submission
**Deployed Link:** [https://sih25-one.vercel.app/](https://sih25-one.vercel.app/)

---

## 1. Executive Summary

The **National Internship & Placement Mission Portal** is a unified, full-stack, enterprise-grade web application designed to streamline, optimize, and secure the internship and placement ecosystem across Indian higher-education institutions. By bringing **Students**, **Faculty Mentors**, **Placement Cells**, and **Employers** onto a single secure platform, the system automates the lifecycle of placements, embeds AI-driven job-student matching, and leverages cloud and API integrations for verification and scheduling.

### Key Highlights
- **Role-Based Workflows**: Tailored user dashboards and functionalities for Students, Faculty, Placement Cells, and Employers.
- **AI-Powered Recommendations**: Hybrid recommendation engine matching students with opportunities based on semantic vector similarity, skills, department, and batch eligibility.
- **Google Meet & Calendar Integration**: Automatic generation of Google Meet links and event scheduling synced to calendars via Google Apps Script.
- **Robust Database**: Scalable PostgreSQL database managed via Prisma ORM, utilizing `pgvector` for embedding searches.
- **Secure Authentication**: Credentials-based authorization powered by NextAuth.js v5 with custom JWT token sessions.

---

## 2. System Architecture

The project is structured as a decoupled multi-layered architecture:

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
│  │  /api/company-requests  /api/upload  /api/email                │    │
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
│  │  • Resumes         │    │     │  │  (all-MiniLM-L6-v2 model)      │ │
│  │  • Feedbacks       │    │     │  └────────────────────────────────┘ │
│  └────────────────────┘    │     └─────────────────────────────────────┘
│                            │
│  ┌────────────────────┐    │
│  │  Cloudinary        │    │
│  │  (File Storage)    │    │
│  └────────────────────┘    │
└─────────────────────────────┘
```

- **Frontend**: Next.js 15 (App Router) with React 19, utilizing Tailwind CSS 4 for modern styling, Radix UI for accessible interface primitives, Recharts for analytics data visualization, and Lucide React icons.
- **Backend API**: Serverless Next.js API endpoints communicating with PostgreSQL.
- **Recommendation Microservice**: FastAPI Python service performing similarity calculations and embedding ingestion.
- **File Storage**: Cloudinary integration for resume and document uploads.

---

## 3. Technology Stack

### Frontend & Styling
* **Framework**: Next.js 15 (App Router)
* **Library**: React 19
* **Styling**: Tailwind CSS 4, Radix UI (Primitives)
* **Visualization**: Recharts
* **Notifications**: Sonner

### Backend & Database
* **Database**: PostgreSQL with `pgvector` extension
* **ORM**: Prisma Client (automatically generated at `lib/generated/prisma`)
* **Auth**: NextAuth.js v5 (Beta)
* **Email**: Mailtrap Integration

### AI/ML Service
* **Framework**: FastAPI with Uvicorn
* **Model**: HuggingFace Inference API (`meta-llama/Meta-Llama-3-8B-Instruct` & `sentence-transformers/all-MiniLM-L6-v2`)
* **Vector Search**: pgvector SQL similarity query

---

## 4. User Roles & Core Workflows

The portal supports four target user types:

### 4.1 Students
- **Capabilities**: Complete a detailed digital profile (CGPA, Branch, Skills, Projects, Certifications), upload resumes via Cloudinary, receive personalized job matches, track application statuses, attend scheduled interviews, and submit internship feedback.
- **Workflow**:
  ```
  Sign Up ──▶ Complete Profile ──▶ Browse AI Recommendations ──▶ Apply with Resume ──▶ Mentor Approval ──▶ Interview Scheduling ──▶ Offer Acceptance
  ```

### 4.2 Faculty Mentors
- **Capabilities**: Act as the first line of validation for student placement requests. Review and approve/reject applications with custom remarks, track mentee progress, and view department metrics.
- **Workflow**:
  ```
  Review Pending Approvals ──▶ Evaluate student application & eligibility ──▶ Add Mentor Remarks ──▶ Approve or Reject
  ```

### 4.3 Placement Cells
- **Capabilities**: High-level administrators of the institution. Onboard employers by approving registration requests, monitor overall placement metrics (placement rate, active drives, top recruiters) through analytical charts, and generate reports.
- **Workflow**:
  ```
  Approve Employer Registrations ──▶ Monitor Opportunities ──▶ Track Drive Statistics ──▶ Review System-wide Analytics
  ```

### 4.4 Employers
- **Capabilities**: Request company registration, post internship and job postings, view AI-matched student recommendations, review applicants, schedule interviews with integrated Google Meet links, review interns, and issue certificates.
- **Workflow**:
  ```
  Register Company ──▶ Post Opportunity ──▶ Inspect Applicants & AI Matches ──▶ Shortlist & Schedule Interviews ──▶ Record Feedback & Hire
  ```

---

## 5. Key Features

### 5.1 AI/ML Recommendation Engine
The FastAPI microservice implements a hybrid scoring system to provide accurate, context-aware job recommendations:
1. **Vector Similarity (40% Weight)**: Computes semantic similarity between the job description (title, details, requirements) and student profiles (skills, projects, branch) using sentence embeddings (`all-MiniLM-L6-v2`).
2. **Skill Match (35% Weight)**: Evaluates the Jaccard similarity index between student skills and job requirements.
3. **Department Match (15% Weight)**: Matches the student’s branch with the eligible departments.
4. **Requirement Match (10% Weight)**: Compares student qualifications against additional custom requirements.
5. **Batch Multiplier**: Adjusts final score based on whether the student's graduation year aligns with the job type (e.g. Internships prioritize pre-final years; full-time positions prioritize graduating/graduated students).

### 5.2 Google Meet & Calendar Integration
When an employer shortlists a student:
- The backend triggers a POST request to a **Google Apps Script Web App** acting as an API gateway to the Google Calendar service.
- The script automatically schedules a Google Calendar event on the student's and employer's calendar, requests Google Meet video conferencing, and returns a verified Google Meet conference link.
- If the Apps Script is not configured, the application falls back safely to a dynamic lookup meeting link.
- The student is notified instantly via in-app notifications and a formatted email sent through Mailtrap.

### 5.3 Automated In-App Notifications
The platform includes an automated notification dispatcher supporting multiple types:
* `interview_scheduled`: Fired when interview links are created.
* `internship_offer`: Fired on successful hires.
* `new_opportunity`: Dispatched to matching students when a new job goes active.
* `new_application`: Notifies employers of new applicants.
* `application_rejected`: Informs students of status changes.
* `new_approval` / `approval_rejected` / `approval_accepted`: Manages the student-faculty validation loop.

### 5.4 Application Lifecycle States
The system maintains strict state-transitions for applications:
```
┌─────────────────────────┐
│ mentor_approval_needed  │
└────────────┬────────────┘
             │ (Faculty Approves)
             ▼
┌─────────────────────────┐
│         applied         │
└────────────┬────────────┘
             │ (Employer Reviews)
             ▼
┌─────────────────────────┐
│        reviewed         │
└────────────┬────────────┘
             │ (Shortlisted for Interview)
             ▼
┌─────────────────────────┐
│       shortlisted       │
└────────────┬────────────┘
      ┌──────┴──────┐
      ▼             ▼
┌───────────┐ ┌───────────┐
│ accepted  │ │ rejected  │
└───────────┘ └───────────┘
```

---

## 6. Database Schema & Key Models

The PostgreSQL database contains the following critical models (defined in [schema.prisma](file:///c:/Users/anupd/OneDrive/Desktop/SIH/SIH%202025/sih25/prisma/schema.prisma)):

- **Student**: Core student profile containing personal details, academic CGPA, branch, batch, skills array, and relationships to resumes, applications, and certifications.
- **Faculty**: Faculty members who mentor a subset of students.
- **PlacementCell**: Admins responsible for institutional placement dashboard operations.
- **Company & CompanyRequest**: Represents registered organizations and pending onboarding requests.
- **Employer**: Recruiter accounts linked to a verified company.
- **Opportunity**: Job or internship listings specifying salary, requirements, eligible departments, and dates.
- **Application**: Holds student-opportunity relationships, track status, cover letters, and mentor comments.
- **Interview**: Stores scheduled dates, durations, and Google Meet URLs.
- **Internship**: Tracks active/completed engagements, salaries, and performance reviews.
- **Certificate**: Links verified files to completed internships.
- **MatchedStudent**: Cache table for AI-matched student-job pairs.

---

## 7. Environment Variables

Create a `.env` file in the root directory and populate it with the following configuration variables:

```env
# Relational Database Connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth Configuration
AUTH_SECRET="your-nextauth-jwt-secret-key"

# Microservices Config
RECOMMENDATION_API_URL="http://127.0.0.1:8000"

# Cloudinary Credentials (File/Resume Uploads)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Email Integration (Mailtrap)
MAILTRAP_TOKEN="your-mailtrap-token"

# Google Calendar/Meet Apps Script Integration
GOOGLE_APPS_SCRIPT_WEB_APP_URL="https://script.google.com/macros/s/.../exec"
GOOGLE_APPS_SCRIPT_TOKEN="your-custom-apps-script-validation-token"
GOOGLE_CALENDAR_ID="primary"

# HuggingFace API Credentials (Embeddings)
HF_API_KEY="your-huggingface-token"
HF_MODEL="meta-llama/Meta-Llama-3-8B-Instruct"
```

---

## 8. Local Setup & Running Instructions

Follow these steps to run the Next.js frontend and FastAPI recommendation engine locally.

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- PostgreSQL Database with `pgvector` extension active

### Step 1: Install Frontend Dependencies
From the project root:
```bash
npm install
```

### Step 2: Database Setup & Migrations
Initialize the Prisma Client and sync your database schema:
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Install ML Service Dependencies
Navigate to the recommendation engine directory, set up a virtual environment, and install dependencies:
```bash
cd recommendation-engine
python -m venv .venv
# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cd ..
```

### Step 4: Run Services
You can run the frontend, the recommendation microservice, or both concurrently.

* **Run Frontend Only**:
  ```bash
  npm run dev
  ```
* **Run Recommendation Engine Only**:
  ```bash
  npm run dev:engine
  ```
* **Run All Concurrently (Recommended)**:
  ```bash
  npm run dev:all
  ```

Once launched, the Next.js frontend is accessible at [http://localhost:3000](http://localhost:3000) and the FastAPI swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 9. API Routes Directory Structure

The serverless APIs are structured under `/app/api`:
- `/api/auth`: NextAuth authentication handler.
- `/api/sign-up/[role]`: Registration logic for student, faculty, and employer endpoints.
- `/api/student`: Dashboard statistics, profile editing, recommendation list, and application submissions.
- `/api/faculty`: Mentorship student tracking and application approval/rejection endpoints.
- `/api/employer`: Posting jobs, fetching applications, dashboard states, and student shortlist endpoints.
- `/api/placementcell`: Onboarding approval flow and campus-wide metrics charts.
- `/api/company-requests`: New employer request validation.
- `/api/upload`: Handles file pipeline to Cloudinary.
- `/api/notification`: Fetches and updates in-app notification logs.
- `/api/recommendation-engine`: Webhooks synchronizing jobs and student embeddings to the FastAPI microservice.

---

## 10. Future Enhancements

1. **Permissioned Blockchain Validation**: Introduce a decentralized ledger for tamper-proof credentials verification, allowing employers to verify certificates via a QR code query.
2. **Resume Parser**: Incorporate LLM-based PDF parsing to extract skills, qualifications, and experience directly into student profile inputs on upload.
3. **Mock Interview Chatbot**: Implement conversational AI interfaces to help students prepare for upcoming interviews based on job specifications.
4. **Predictive Statistics**: Introduce placement conversion rate forecasts and student performance tracking over time for placement offices.
