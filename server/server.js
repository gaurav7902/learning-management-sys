require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./config/database");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: [process.env.CLIENT_URL],
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Reuse one connection across serverless invocations and wait for it before a
// controller runs a Mongoose query. Without this, queries can buffer for 10s
// during a cold start and fail with a Mongoose buffering timeout.
connectToDatabase()
    .then(() => console.log("MongoDB is connected"))
    .catch((error) => console.error("MongoDB connection failed:", error.message));

app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error("MongoDB is unavailable:", error.message);
        res.status(503).json({
            success: false,
            message: "Database is temporarily unavailable. Please try again.",
        });
    }
});

//routes configuration
app.use("/health", (req, res) => {
    res.send("Server is running...");
});
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is now running on port ${PORT}`);
    });
}

module.exports = app;
