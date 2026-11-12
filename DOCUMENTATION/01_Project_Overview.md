# CM Kerala – Public Grievance Redressal Portal

## 1. Project Introduction

The CM Kerala Public Grievance Redressal Portal is a web-based application designed to simplify the process of submitting, managing, tracking, and resolving public grievances.

The platform provides a centralized system where citizens can submit complaints related to public services and government departments. Administrators can review complaints, assign them to the appropriate departments and officers, and monitor their progress.

Department officers can investigate assigned grievances, update their status, and submit action-taken reports. Citizens can track their complaints and provide feedback after resolution.

The system also integrates an AI-powered assistant to analyze submitted grievances and suggest relevant departments, categories, priorities, and summaries.

**Project Notice:** This application is a recruitment machine-test prototype and is not an official Government of Kerala website or government service.

## 2. Problem Statement

Traditional grievance management processes can involve several challenges:

- Difficulty submitting and tracking public complaints.
- Lack of centralized grievance management.
- Delays in assigning complaints to appropriate departments.
- Limited visibility into grievance progress.
- Difficulty monitoring officer performance and resolution timelines.
- Manual effort required to categorize and prioritize complaints.

The proposed application addresses these challenges through a centralized digital grievance management platform.

## 3. Project Objectives

The main objectives are:

1. Provide citizens with an easy-to-use grievance submission platform.
2. Generate unique reference numbers for submitted complaints.
3. Enable administrators to review and assign grievances.
4. Allow department officers to investigate and update complaints.
5. Maintain grievance status history and accountability.
6. Provide citizens with grievance tracking and feedback facilities.
7. Integrate AI-assisted grievance analysis.
8. Provide dashboards and statistics for grievance monitoring.

## 4. Main Features

### 4.1 Public Website
- Home page
- About the portal
- How It Works
- Department information
- Contact form
- Frequently Asked Questions

### 4.2 Citizen Portal
- Citizen registration and login.
- Submit new grievances.
- Upload supporting documents and images.
- Generate unique grievance reference numbers.
- View submitted grievances.
- Track grievance status.
- View resolution details.
- Submit feedback after resolution.

### 4.3 CMO Administrator Dashboard
- View all submitted grievances.
- Monitor total, pending, resolved, and overdue grievances.
- Search and filter grievances.
- View grievance details and attachments.
- Assign grievances to departments and officers.
- Add administrative remarks.
- Review officer action-taken reports.
- Approve resolution or request further action.
- View AI-generated grievance analysis.

### 4.4 Department Officer Dashboard
- View assigned grievances.
- Access grievance details and attachments.
- Update grievance status.
- Add investigation remarks.
- Submit action-taken reports.
- Provide resolution details to the administrator.

### 4.5 AI Integration
The application integrates Google's Gemini API for AI-assisted grievance analysis.

AI capabilities include:
- Suggested department identification.
- Suggested grievance category.
- Priority recommendation (Low, Medium, High).
- Complaint summarization.
- Possible duplicate grievance identification.

AI suggestions are intended to assist administrators. Final decisions and assignments remain under human control.

## 5. User Roles

The application supports three primary user roles.

| Role | Responsibilities |
|---|---|
| Citizen | Register, submit grievances, track complaints, and provide feedback. |
| Administrator (CMO) | Review grievances, assign departments and officers, monitor progress, and approve reports. |
| Department Officer | Investigate assigned grievances, update status, and submit action-taken reports. |

Role-based authentication and authorization restrict access to protected application features.

## 6. Technology Stack

### Frontend
- React.js
- Vite
- Material UI Joy
- React Router DOM
- Axios
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- REST APIs
- JSON Web Token (JWT)
- bcrypt
- Multer

### Database
- MongoDB
- Mongoose

### AI Integration
- Google Gemini API
- Google GenAI SDK

### Development Tools
- Visual Studio Code
- Postman
- Git and GitHub
- MongoDB Atlas

## 7. Grievance Workflow

The application follows a structured grievance resolution process.

1. **Grievance Submission:** A citizen registers, logs in, and submits a complaint with relevant details and optional attachments.

2. **Reference Generation:** The system generates a unique reference number for tracking.

3. **CMO Review:** The administrator reviews the complaint and can use AI-generated suggestions to assist with classification and prioritization.

4. **Department Assignment:** The administrator assigns the grievance to the appropriate department and officer.

5. **Officer Investigation:** The assigned officer investigates the complaint, updates its status, and adds investigation remarks.

6. **Action-Taken Report:** The officer submits an action-taken report with resolution details.

7. **CMO Review:** The administrator reviews the report and either approves the resolution or requests further action.

8. **Citizen Notification and Tracking:** The citizen can view the updated grievance status and resolution details.

9. **Feedback:** After resolution, the citizen can submit feedback.

## 8. Grievance Statuses

| Status | Description |
|---|---|
| Submitted | Grievance has been submitted by a citizen. |
| Under Review | Administrator is reviewing or processing the grievance. |
| In Progress | Assigned department officer is investigating the grievance. |
| Resolved | Grievance resolution has been approved. |
| Reopened | Further investigation or action is required. |

The system maintains grievance status history, including timestamps and the user responsible for each update.

## 9. Security and Access Control

The application implements the following security features:

- Password hashing using bcrypt.
- JWT-based authentication.
- Role-based authorization.
- Protected API endpoints.
- Input validation.
- File type and file size restrictions.
- Environment variables for sensitive configuration.

Additional production security measures, including authenticated attachment access and stronger file-content validation, should be applied before real-world deployment.

## 10. Conclusion

The CM Kerala Public Grievance Redressal Portal demonstrates how a centralized web application can improve grievance submission, departmental coordination, complaint tracking, and resolution monitoring.

By combining role-based access control, structured workflows, file handling, dashboards, and AI-assisted analysis, the application provides a prototype solution for digital public grievance management.