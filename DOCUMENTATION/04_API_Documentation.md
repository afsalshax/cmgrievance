
# API Documentation

## 1. Overview

The CM Kerala Public Grievance Redressal Portal uses RESTful APIs developed with Node.js and Express.js.

The APIs handle authentication, grievance management, department assignments, officer operations, AI analysis, and contact enquiries.

### Base URL

```text
http://localhost:5000/api
```

### Authentication

Protected endpoints require a JWT token in the Authorization header.

```http
Authorization: Bearer <JWT_TOKEN>
```

### Common HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid request |
| 401 | Authentication required or invalid token |
| 403 | Access forbidden |
| 404 | Resource not found |
| 500 | Internal server error |

---

## 2. Authentication APIs

Base path: `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a citizen |
| POST | `/login` | Public | Authenticate a user |
| GET | `/profile` | Authenticated | Get logged-in user profile |

### Register Citizen

**POST** `/api/auth/register`

Request body:

```json
{
  "name": "Sample Citizen",
  "email": "citizen@example.com",
  "mobile": "9876543210",
  "password": "Password123"
}
```

### Login

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "citizen@example.com",
  "password": "Password123"
}
```

The response contains the authentication token and user information.

### Get Profile

**GET** `/api/auth/profile`

Requires a valid JWT token.

---

## 3. Department APIs

Base path: `/api/departments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Retrieve available departments |

### Get Departments

**GET** `/api/departments`

Returns the list of departments available for grievance assignment.

---

## 4. Citizen Grievance APIs

Base path: `/api/grievances`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Citizen | Submit a grievance |
| GET | `/my` | Citizen | Retrieve citizen grievances |
| GET | `/track/:referenceNumber` | Public | Track grievance using reference number |
| POST | `/:id/feedback` | Citizen | Submit grievance feedback |

### Submit Grievance

**POST** `/api/grievances`

Content type: `multipart/form-data`

Fields:

- district
- category
- subject
- description
- attachments (maximum 3 files)

The response contains the generated grievance reference number.

### Get My Grievances

**GET** `/api/grievances/my`

Requires citizen authentication.

### Track Grievance

**GET** `/api/grievances/track/:referenceNumber`

Example:

```text
GET /api/grievances/track/CMK-2026-12345678
```

Retrieves grievance tracking information using the reference number.

Public responses should exclude internal remarks and personal information.

### Submit Feedback

**POST** `/api/grievances/:id/feedback`

Allows a citizen to submit feedback after the grievance is resolved.

---

## 5. Administrator APIs

Base path: `/api/admin`

All endpoints require administrator authentication.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard/stats` | Admin | Retrieve dashboard statistics |
| GET | `/grievances` | Admin | Retrieve all grievances |
| GET | `/grievances/:id` | Admin | Retrieve grievance details |
| PATCH | `/grievances/:id/assign` | Admin | Assign department and officer |
| PATCH | `/grievances/:id/status` | Admin | Update grievance status |
| POST | `/grievances/:id/remarks` | Admin | Add administrative remarks |
| POST | `/grievances/:id/analyze` | Admin | Generate AI analysis |

### Dashboard Statistics

**GET** `/api/admin/dashboard/stats`

Returns:

- Total grievances
- Pending grievances
- Resolved grievances
- Overdue grievances

### Get All Grievances

**GET** `/api/admin/grievances`

Supports filtering and searching using query parameters such as:

- status
- district
- category
- priority
- search

Example:

```text
GET /api/admin/grievances?status=Submitted&priority=High
```

### Get Grievance Details

**GET** `/api/admin/grievances/:id`

Retrieves grievance details and relevant status history.

### Assign Grievance

**PATCH** `/api/admin/grievances/:id/assign`

Request body:

```json
{
  "departmentId": "DEPARTMENT_OBJECT_ID",
  "officerId": "OFFICER_OBJECT_ID"
}
```

### Update Grievance Status

**PATCH** `/api/admin/grievances/:id/status`

Request body:

```json
{
  "status": "Resolved",
  "remarks": "Action taken report reviewed and approved."
}
```

### Add Administrative Remarks

**POST** `/api/admin/grievances/:id/remarks`

Adds administrative remarks to the grievance.

### AI Grievance Analysis

**POST** `/api/admin/grievances/:id/analyze`

Generates AI-assisted suggestions, including department, category, priority, summary, and possible duplicate identification.

---

## 6. Department Officer APIs

Base path: `/api/officer`

All endpoints require officer authentication.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/grievances` | Officer | Retrieve assigned grievances |
| GET | `/grievances/:id` | Officer | Retrieve assigned grievance details |
| PATCH | `/grievances/:id/status` | Officer | Update grievance status |
| POST | `/grievances/:id/report` | Officer | Submit action-taken report |

### Get Assigned Grievances

**GET** `/api/officer/grievances`

Returns grievances assigned to the logged-in officer.

### Get Grievance Details

**GET** `/api/officer/grievances/:id`

Retrieves details of a grievance assigned to the authenticated officer.

### Update Grievance Status

**PATCH** `/api/officer/grievances/:id/status`

Request body:

```json
{
  "status": "In Progress",
  "investigationRemarks": "Investigation has started."
}
```

### Submit Action-Taken Report

**POST** `/api/officer/grievances/:id/report`

Submits the officer's investigation findings and action-taken report.

---

## 7. Contact APIs

Base path: `/api/contact`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Submit a contact enquiry |

### Submit Contact Enquiry

**POST** `/api/contact`

Request body:

```json
{
  "name": "Sample User",
  "email": "sample@example.com",
  "subject": "Portal Enquiry",
  "message": "I need information about the grievance process."
}
```

The enquiry is stored in the ContactEnquiries collection.

---

## 8. File Upload API Details

Grievance attachments are uploaded through the grievance submission endpoint.

Supported file types:

- JPEG
- PNG
- WEBP
- PDF
- DOC
- DOCX

Restrictions:

- Maximum file size: 5 MB.
- Maximum attachments: 3.

Multer handles multipart form data and stores the uploaded files in the backend uploads directory.

---

## 9. API Security

The backend implements:

- JWT-based authentication.
- Role-based authorization.
- Password hashing using bcrypt.
- Protected administrator and officer routes.
- Citizen-specific grievance access controls.
- Request validation.
- File upload restrictions.

---

## 10. API Testing

The REST APIs can be tested using Postman.

Recommended testing sequence:

1. Register a citizen.
2. Log in and obtain a JWT token.
3. Submit a grievance.
4. Retrieve citizen grievances.
5. Log in as administrator.
6. Assign the grievance to a department and officer.
7. Log in as officer.
8. Update grievance status.
9. Submit an action-taken report.
10. Log in as administrator and resolve the grievance.
11. Track the grievance as a citizen.
12. Submit feedback.

**Note:** Endpoint names, HTTP methods, request fields, and response formats in this document must match the actual backend route and controller implementations.