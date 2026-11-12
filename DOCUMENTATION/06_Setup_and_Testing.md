
# Setup and Testing Guide

## 1. Prerequisites

Install the following tools before running the application:

- Node.js (LTS version recommended)
- npm
- MongoDB Atlas account or local MongoDB installation
- Git
- Visual Studio Code
- Postman (optional, for API testing)
- Google Gemini API key (for AI analysis)

## 2. Project Structure

```text
cm-kerala-grievance-portal/
│
├── frontend/
├── backend/
├── DOCUMENTATION/
├── README.md
└── .env.example
```

## 3. Clone the Repository

Clone the project from GitHub:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd cm-kerala-grievance-portal
```

## 4. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory.

Example configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_configured_gemini_model

ADMIN_NAME=CMO Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

OFFICER_NAME=Department Officer
OFFICER_EMAIL=officer@example.com
OFFICER_PASSWORD=your_officer_password
OFFICER_DEPARTMENT=Public Works Department
```

Replace the example values with your actual configuration.

**Important:** Never commit the `.env` file to GitHub.

Start the backend server:

```bash
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

Verify the server using:

```text
http://localhost:5000/
```

## 5. Database Setup

The application uses MongoDB.

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a database cluster.
3. Configure database access credentials.
4. Allow your development IP address in network access.
5. Copy the MongoDB connection string.
6. Add it to the backend `.env` file as `MONGO_URI`.

Run the department seed script:

```bash
node seedDepartments.js
```

Run the administrator seed script:

```bash
node seedAdmin.js
```

Run the officer seed script:

```bash
node seedOfficer.js
```

Run these scripts from the backend directory, using the actual script filenames in your project.

## 6. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

The frontend Axios configuration should point to the backend API:

```text
http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

## 7. Running the Application

Start both servers:

**Terminal 1 – Backend**

```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend**

```bash
cd frontend
npm run dev
```

Open the frontend URL in a browser:

```text
http://localhost:5173
```

## 8. Testing

The application was tested using manual functional testing and API testing.

### 8.1 Authentication Testing

| Test Case | Expected Result |
|---|---|
| Citizen registration | Account created successfully |
| Valid login | User authenticated |
| Invalid login | Error message displayed |
| Admin login | Admin dashboard opened |
| Officer login | Officer dashboard opened |
| Logout | Token and user data cleared |
| Unauthorized access | Redirect or access denied |

### 8.2 Citizen Testing

| Test Case | Expected Result |
|---|---|
| Submit grievance | Grievance created |
| Submit empty form | Validation error |
| Upload attachments | Files uploaded successfully |
| Upload more than 3 files | Request rejected |
| Upload file above 5 MB | Request rejected |
| View dashboard | Citizen grievances displayed |
| Track grievance | Current status displayed |
| Submit feedback after resolution | Feedback saved |

### 8.3 Administrator Testing

| Test Case | Expected Result |
|---|---|
| View dashboard | Statistics displayed |
| View grievances | Grievance list displayed |
| Search grievances | Matching results displayed |
| Filter grievances | Filtered results displayed |
| View grievance details | Full administrative details displayed |
| Assign department and officer | Assignment saved |
| Run AI analysis | Suggestions displayed when service is available |
| Review action-taken report | Report displayed |
| Approve resolution | Grievance marked as resolved |

### 8.4 Officer Testing

| Test Case | Expected Result |
|---|---|
| View assigned grievances | Assigned list displayed |
| Open grievance | Details displayed |
| Update status | Status updated |
| Add investigation remarks | Remarks saved |
| Submit action-taken report | Report submitted |
| Access unassigned grievance | Access denied |

### 8.5 Security Testing

| Test Case | Expected Result |
|---|---|
| Access protected API without token | 401 Unauthorized |
| Citizen accesses admin API | 403 Forbidden |
| Officer accesses admin API | 403 Forbidden |
| Invalid JWT token | Request rejected |
| Unauthorized officer accesses another officer's grievance | Access denied |
| Invalid file type | Upload rejected |

## 9. Testing Tools

| Tool | Purpose |
|---|---|
| Postman | REST API testing |
| Browser Developer Tools | Frontend debugging |
| MongoDB Atlas | Database verification |
| Visual Studio Code | Development and debugging |

## 10. Known Limitations

- AI analysis depends on Gemini API availability and quota.
- Attachments are stored locally in the current implementation.
- Production deployment requires persistent file storage.
- Public attachment access should be replaced with authenticated access.
- Email or SMS notifications are not included unless separately configured.

## 11. Conclusion

The application was tested across its main user roles and grievance lifecycle.

The testing process covers authentication, grievance submission, administrative assignment, officer investigation, action-taken report submission, resolution, and citizen feedback.