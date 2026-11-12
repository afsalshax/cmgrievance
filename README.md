# CM Kerala – Public Grievance Redressal Portal

A full-stack web application designed to simplify public grievance submission, departmental assignment, investigation, tracking, and resolution.

> **Note:** This is a recruitment machine-test prototype. It is not an official Government of Kerala website or government service.

## Overview

The CM Kerala Public Grievance Redressal Portal provides a centralized platform where citizens can submit complaints, track their progress, and receive resolution updates.

Administrators can review grievances, assign departments and officers, monitor progress, and approve action-taken reports.

Department officers can investigate assigned complaints, update statuses, and submit action-taken reports.

The application also integrates Google's Gemini API to provide AI-assisted grievance analysis.

## Key Features

### Citizen Portal
- Citizen registration and login.
- Submit grievances with supporting attachments.
- Unique grievance reference number generation.
- Track grievance status and history.
- View resolution details.
- Submit feedback after resolution.

### CMO Administrator Dashboard
- Dashboard statistics and charts.
- View and manage all grievances.
- Search and filter complaints.
- Assign departments and officers.
- AI-powered grievance analysis.
- Review action-taken reports.
- Approve resolutions or request further action.

### Department Officer Dashboard
- View assigned grievances.
- Access complaint details and attachments.
- Update investigation status.
- Add investigation remarks.
- Submit action-taken reports.

### Public Website
- Home
- About
- How It Works
- Departments
- Contact
- FAQ

### AI Integration
- Department recommendation.
- Category recommendation.
- Priority suggestion.
- Complaint summarization.
- Possible duplicate identification.

AI suggestions are reviewed by administrators and do not automatically make official decisions.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| UI Framework | Material UI Joy |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| File Upload | Multer |
| AI Integration | Google Gemini API |
| API Testing | Postman |
| Version Control | Git, GitHub |

## Project Structure

```text
cm-kerala-grievance-portal/
│
├── frontend/
│
├── backend/
│
├── DOCUMENTATION/
│   ├── 01_Project_Overview.md
│   ├── 02_System_Architecture.md
│   ├── 03_Database_Design.md
│   ├── 04_API_Documentation.md
│   ├── 05_AI_Integration.md
│   ├── 06_Setup_and_Testing.md
│   └── 07_User_Guide.md
│
├── .env.example
├── .gitignore
└── README.md
```

## Application Workflow

```text
Citizen Registration
        |
        v
Grievance Submission
        |
        v
Unique Reference Generation
        |
        v
CMO Administrator Review
        |
        v
Department and Officer Assignment
        |
        v
Officer Investigation
        |
        v
Action-Taken Report Submission
        |
        v
CMO Report Review
        |
        v
Resolution Approval
        |
        v
Citizen Tracking and Feedback
```

## Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas or local MongoDB
- Google Gemini API key (for AI analysis)

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd cm-kerala-grievance-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using the configuration provided in `.env.example`.

Start the backend:

```bash
npm run dev
```

### 3. Database Setup

Configure your MongoDB connection string in the backend environment file.

Run the database seed scripts from the backend directory:

```bash
node seedDepartments.js
node seedAdmin.js
node seedOfficer.js
```

Use the actual seed-script filenames from your project if they differ.

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application:

```text
http://localhost:5173
```

## User Roles

| Role | Access |
|---|---|
| Citizen | Submit, track, and provide feedback on grievances |
| Admin | Manage grievances, assign officers, and review reports |
| Officer | Investigate assigned grievances and submit reports |

## Grievance Statuses

- Submitted
- Under Review
- In Progress
- Resolved
- Reopened

The application maintains grievance status history with timestamps and responsible user information.

## API Documentation

Backend APIs are organized into the following modules:

- Authentication APIs
- Citizen Grievance APIs
- Administrator APIs
- Department Officer APIs
- Department APIs
- Contact APIs

For endpoint details, request formats, and authentication requirements, see:

`DOCUMENTATION/04_API_Documentation.md`

## Testing

The application has undergone functional testing covering:

- User registration and authentication.
- Role-based route protection.
- Grievance submission.
- Attachment uploads.
- Department and officer assignment.
- Officer investigation.
- Action-taken report submission.
- Administrator report review.
- Grievance resolution.
- Citizen tracking and feedback.
- Logout functionality.

API testing was performed using Postman.

## Screenshots

Add application screenshots here before publishing the repository.

Suggested screenshots:

1. Public Home Page
2. Citizen Dashboard
3. Grievance Submission Page
4. CMO Administrator Dashboard
5. Grievance Management Page
6. Officer Dashboard
7. AI Analysis Result
8. Grievance Tracking Page

## Documentation

Detailed project documentation is available in the `DOCUMENTATION` directory.

- Project Overview
- System Architecture
- Database Design
- API Documentation
- AI Integration
- Setup and Testing
- User Guide

## Environment Configuration

The application uses environment variables for database credentials, authentication secrets, and AI API configuration.

Never commit actual `.env` files, passwords, database credentials, or API keys to GitHub.

Refer to `.env.example` for the required configuration variables.

## Future Enhancements

- Email and SMS notifications.
- Advanced grievance analytics.
- Secure cloud-based attachment storage.
- Advanced duplicate complaint detection.
- Multilingual support.
- Automated escalation notifications.
- Pagination and advanced reporting.

## Author

**Software Engineer | Full Stack Developer**

GitHub: https://github.com/afsalshax

LinkedIn: https://linkedin.com/in/afsal-sha-s

## License

This project was developed as a recruitment machine-test prototype for demonstration and evaluation purposes.