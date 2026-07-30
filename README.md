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
    ├── middleware/        # Auth and validation middleware
    ├── models/             # MongoDB schemas (User, Course, Order, Progress)
    └── routes/            # API route definitions
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+)
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
3. Copy `server/.env.example` to `server/.env` and replace the placeholder
   values with your own credentials:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    CLIENT_URL=http://localhost:5173
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    PAYPAL_CLIENT_ID=your_paypal_client_id
    PAYPAL_SECRET_ID=your_paypal_secret_id
    JWT_SECRET=your_jwt_secret
    ```
4. Start the server:
    ```bash
    npm start
    ```

### Seed sample data

From the `server` directory, run the following command to remove existing LMS
data and Cloudinary image/video uploads. It uploads the four images and two
videos from `server/assets`, then creates two instructors, two students, one
admin, and eight published courses using every image/video combination:

```bash
npm run seed
```

Both sample accounts use the password `Password123!`.

### Frontend Setup

1. Navigate to the client directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Copy `client/.env.example` to `client/.env` and set the API URL:
    ```env
    VITE_BACKEND_URI=http://localhost:5000
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

## 📦 Demo Deployment

Deploy the client and server as separate applications:

- **Client:** Run `npm run build` in `client`. Deploy the generated `client/dist`
  directory as a static site, with `VITE_BACKEND_URI` set to the deployed server URL
  at build time.
- **Server:** Run `npm install` and `npm start` in `server`. Set `CLIENT_URL` to
  the deployed client URL and provide all values from `server/.env.example`.
- **Payments:** Use PayPal sandbox credentials for demonstrations.

The client production build is verified with `npm run build` from `client`.

## 🧹 Code Quality

The repository uses the root [`.prettierrc`](.prettierrc) configuration. Format
all supported files with:

```bash
npx prettier --write .
```

Check the client code with:

```bash
cd client
npm run lint
```

## 🛡️ Security

- The application uses `RouteGuard` on the frontend and custom authentication middleware on the backend to ensure that only authorized users can access sensitive routes.
- Passwords are encrypted/hashed before being stored in the database.
- CORS is configured to allow requests only from the trusted client URL.
- Environment files are ignored by Git; never commit real database, Cloudinary,
  PayPal, or JWT credentials.
