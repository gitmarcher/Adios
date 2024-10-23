# Adios - Academic Leave Management System

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 📖 Overview

Adios is a comprehensive leave management system. It streamlines the process of managing student leave requests through a sophisticated multi-level approval workflow involving parents, faculty, wardens, and academic administrators.

### 🎯 Key Features

- **Multi-Level Approval Workflow**
  - Student submission
  - Parent consent with image verification
  - Faculty advisor review
  - Warden approval (for hostel residents)
  - Academic department final approval

- **Role-Based Dashboards**
  - Student portal for leave requests and status tracking
  - Parent interface for consent management
  - Faculty dashboard for request review
  - Warden oversight for hostel students
  - Academic administrative controls

- **Security & Authentication**
  - Role-based access control
  - Secure localStorage management
  - Automated login functionality

## 🏗️ System Architecture

### Frontend
- **Technology**: React
- **Styling**: Tailwind CSS
- **Routing**: react-router-dom
- **Features**:
  - Role-specific interfaces
  - Loading animations for instant feedback

### Backend
- **Technology**: Node.js + Express
- **Deployment**: AWS EC2 (Port 5000)
- **Features**:
  - RESTful API endpoints
  - Authentication middleware
  - Error logging system

### Database
- **Technology**: PostgreSQL via Supabase
- **Schema**:
  ```
  Students
  ├── roll_number (PK)
  ├── name, email, phone
  ├── address, hostel
  └── faculty (FK)

  Parents
  ├── roll_number (FK)
  ├── name, phone
  └── email

  Faculties
  ├── name (PK)
  ├── email
  └── hostel

  Leave_Applications
  ├── leave_id (PK)
  ├── roll_number (FK)
  ├── purpose, days
  ├── start_date, end_date
  ├── parent_consent
  ├── approvals
  └── status
  ```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/adios.git
   cd adios
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend .env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key

   # Frontend .env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Run the application**
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd frontend
   npm start
   ```

## 🔧 Deployment

Currently deployed on AWS EC2 with the following setup:
### EC2 Instance
- **Instance Type**: t2.micro
- **Operating System**: Ubuntu 20.04

### Network Configuration
- **Ports**:
  - **80** for HTTP
  - **443** for HTTPS

### Deployment Method
- **Method**: rsync
  - Utilized for synchronizing files between the local environment and the EC2 instance.

### Web Server Configuration
- **Server**: Nginx
  - Configured to serve static files and reverse proxy requests to the application.

## 🛣️ Future Roadmap

- [ ] Email notification system
- [ ] Advanced admin dashboard


## 👥 Contact

- Project Link: [https://github.com/gitmarcher/adios](https://github.com/gitmarcher/adios)

---
