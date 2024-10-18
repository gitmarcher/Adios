# Adios - Leave Management System

Adios is a multi-level leave management system designed for institutes to handle leave requests efficiently. The system streamlines the approval process through different stages, from students to parents, faculty advisors, wardens, and academic administrators, ensuring transparency and accountability.

---

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [System Workflow](#system-workflow)
5. [Installation](#installation)

---

## Features
- **Multi-level approval**: Involves parents, faculty advisors, wardens, and academics.
- **Image-based consent**: Parent verification through photo uploads.
- **User authentication**: Secure login for students, faculty, and admins.
- **Real-time status tracking**: Students can monitor the approval process.
- **Email notifications**: Alerts at various stages of the leave request.

---

## Tech Stack
### Frontend
- **React**: User interface development
- **Tailwind CSS**: Styling

### Backend
- **Node.js & Express**: Server-side logic and API routes
- **PostgreSQL**: Relational database for storing data

### Hosting
- **Supabase**: Database as a service (PostgreSQL)

---

## Database Schema
The system uses the following primary tables:

1. **Leave_Applications**  
   - Stores leave requests with status updates from parents, faculty, and warden.

2. **Students**  
   - Contains student information like roll number, contact details, and faculty advisor.

3. **Parents**  
   - Stores parent details, including login credentials for consent.

4. **Faculties**  
   - Manages faculty details for approval workflows.

---

## System Workflow
1. **Student**: Creates a leave request and submits it.
2. **Parent**: Provides consent by uploading an image.
3. **Faculty Advisor**: Reviews the request for initial approval.
4. **Warden**: Grants hostel approval.
5. **Academic Section**: Provides final approval and records the leave.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/adios.git
   cd adios
# Leave Management System

A comprehensive system for managing student leave requests in an educational institution.

## Quick Start

1. **Install dependencies for both frontend and backend**:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Create a `.env` file in the backend directory**:

   ```plaintext
   PORT=5000
   DATABASE_KEY = YOUR_DATABASE_KEY
   DATABASE_URL = YOUR_DATABASE_URL

   ```

3. **Run the backend server**:

   ```bash
   cd backend
   npm run dev
   ```

4. **Run the frontend**:

   ```bash
   cd frontend
   npm start
   ```
