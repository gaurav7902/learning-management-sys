# LMS - Learning Management System

A comprehensive full-stack Learning Management System (LMS) that enables instructors to create and manage online courses and allows students to discover, purchase, and learn from them.

## 🚀 Features

### For Instructors
- **Dashboard**: Overview of managed courses.
- **Course Management**: 
  - Create and edit courses with detailed metadata (title, category, level, description, etc.).
  - Define course pricing and welcome messages.
  - Build a structured curriculum with multiple lectures.
- **Media Management**: Upload course thumbnails and lecture videos integrated with Cloudinary.
- **Student Tracking**: View students enrolled in courses.

### For Students
- **Course Discovery**: Browse available courses and view detailed information including syllabus and pricing.
- **Seamless Enrollment**: Integrated payment gateway via PayPal for secure course purchases.
- **Learning Experience**:
  - Dedicated course player for watching lecture videos.
  - Track progress through lectures and overall course completion.
- **My Courses**: Access a personal library of purchased courses.

### Core System
- **Role-Based Access Control (RBAC)**: Distinct interfaces and permissions for Instructors and Students.
- **Authentication**: Secure user login and registration.
- **Progress Tracking**: Persistent tracking of lecture completion for students.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT-based authentication middleware

### External Integrations
- **Media Storage**: [Cloudinary](https://cloudinary.com/) (Images and Videos)
- **Payments**: [PayPal](https://developer.paypal.com/)

## 📂 Project Structure

```text
.
├── client/                # React frontend
│   ├── src/
│   │   ├── api/           # API configuration (Axios instance)
│   │   ├── components/    # Reusable UI components (Instructor/Student views)
│   │   ├── context/       # Global state (Auth, Instructor, Student)
│   │   ├── pages/         # Application pages (Auth, Instructor, Student)
│   │   └── services/      # Business logic and API services
│   └── public/            # Static assets
└── server/                # Node.js backend
    ├── controllers/       # Request handlers (Auth, Instructor, Student)
    ├── helpers/           # Integration helpers (Cloudinary, PayPal)
    ├── middleware/       # Auth and validation middleware
    ├── models/             # MongoDB schemas (User, Course, Order, Progress)
    └── routes/            # API route definitions
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB account/cluster
- Cloudinary account
- PayPal Developer account

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` root and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:5173
   # Add other required keys for Cloudinary and PayPal
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛡️ Security
- The application uses `RouteGuard` on the frontend and custom authentication middleware on the backend to ensure that only authorized users can access sensitive routes.
- Passwords are encrypted/hashed before being stored in the database.
- CORS is configured to allow requests only from the trusted client URL.
