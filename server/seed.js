require("dotenv").config();

const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const mongoose = require("mongoose");
const path = require("path");
const Course = require("./models/Course");
const CourseProgress = require("./models/CourseProgress");
const {
    clearCloudinaryAssets,
    uploadMediaToCloudinary,
} = require("./helpers/cloudinary");
const Order = require("./models/Order");
const StudentCourses = require("./models/StudentCourses");
const User = require("./models/User");

const ASSETS_DIRECTORY = path.join(__dirname, "assets");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);

const getAssets = async (directory, allowedExtensions) => {
    const files = await fs.readdir(directory);
    return files
        .filter((file) =>
            allowedExtensions.has(path.extname(file).toLowerCase())
        )
        .sort((first, second) =>
            first.localeCompare(second, undefined, { numeric: true })
        )
        .map((file) => path.join(directory, file));
};

const uploadSeedAssets = async () => {
    const [imageFiles, videoFiles] = await Promise.all([
        getAssets(path.join(ASSETS_DIRECTORY, "images"), IMAGE_EXTENSIONS),
        getAssets(path.join(ASSETS_DIRECTORY, "vids"), VIDEO_EXTENSIONS),
    ]);

    if (imageFiles.length !== 4 || videoFiles.length !== 2) {
        throw new Error(
            "The seed requires exactly 4 images and 2 videos in server/assets"
        );
    }

    const [images, videos] = await Promise.all([
        Promise.all(
            imageFiles.map((filePath) =>
                uploadMediaToCloudinary(filePath, {
                    folder: "lms-seed/images",
                    resource_type: "image",
                })
            )
        ),
        Promise.all(
            videoFiles.map((filePath) =>
                uploadMediaToCloudinary(filePath, {
                    folder: "lms-seed/videos",
                    resource_type: "video",
                })
            )
        ),
    ]);

    return images.flatMap((image) =>
        videos.map((video) => ({
            imageUrl: image.secure_url,
            videoUrl: video.secure_url,
            videoPublicId: video.public_id,
        }))
    );
};

const seedDatabase = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error(
            "MONGO_URI must be set before running the seed command"
        );
    }

    if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ) {
        throw new Error("Cloudinary credentials must be set before seeding");
    }

    await clearCloudinaryAssets();
    const courseMediaCombinations = await uploadSeedAssets();

    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([
        CourseProgress.deleteMany({}),
        Order.deleteMany({}),
        StudentCourses.deleteMany({}),
        Course.deleteMany({}),
        User.deleteMany({}),
    ]);

    const password = await bcrypt.hash("Password123!", 12);
    const [ava, liam, noah, mia, admin] = await User.create([
        {
            userName: "Ava Sharma",
            userEmail: "ava.sharma@example.com",
            password,
            role: "instructor",
        },
        {
            userName: "Liam Chen",
            userEmail: "liam.chen@example.com",
            password,
            role: "instructor",
        },
        {
            userName: "Noah Patel",
            userEmail: "noah.patel@example.com",
            password,
            role: "student",
        },
        {
            userName: "Mia Wilson",
            userEmail: "mia.wilson@example.com",
            password,
            role: "student",
        },
        {
            userName: "Jordan Lee",
            userEmail: "jordan.lee@example.com",
            password,
            role: "admin",
        },
    ]);

    const courseDetails = [
        [
            ava,
            "Modern JavaScript Foundations",
            "web-development",
            "beginner",
            4.99,
            "Build confidence with JavaScript essentials.",
        ],
        [
            ava,
            "React Fundamentals",
            "web-development",
            "beginner",
            5.99,
            "Create responsive interfaces with React.",
        ],
        [
            ava,
            "Node.js and Express APIs",
            "backend-development",
            "intermediate",
            6.99,
            "Build reliable REST APIs with Node.js and Express.",
        ],
        [
            ava,
            "SQL for Data Analysis",
            "data-science",
            "beginner",
            4.99,
            "Query and analyze data with practical SQL.",
        ],
        [
            liam,
            "Python Programming Essentials",
            "software-engineering",
            "beginner",
            5.99,
            "Write clear, effective Python programs.",
        ],
        [
            liam,
            "UI Design Principles",
            "web-development",
            "beginner",
            3.99,
            "Design intuitive, accessible user interfaces.",
        ],
        [
            liam,
            "Digital Marketing Strategy",
            "artificial-intelligence",
            "intermediate",
            6.99,
            "Plan and measure effective digital campaigns.",
        ],
        [
            liam,
            "Agile Project Management",
            "software-engineering",
            "intermediate",
            5.99,
            "Lead collaborative projects using Agile practices.",
        ],
    ];

    const courses = await Course.create(
        courseDetails.map(
            (
                [instructor, title, category, level, pricing, subtitle],
                index
            ) => ({
                instructorId: instructor._id.toString(),
                instructorName: instructor.userName,
                title,
                category,
                level,
                primaryLanguage: "english",
                subtitle,
                description: `${subtitle} This course includes practical examples and guided exercises.`,
                image: courseMediaCombinations[index].imageUrl,
                welcomeMessage: `Welcome to ${title}!`,
                pricing,
                objectives: `Build practical skills in ${title}.`,
                curriculum: [
                    {
                        title: `Introduction to ${title}`,
                        videoUrl: courseMediaCombinations[index].videoUrl,
                        public_id: courseMediaCombinations[index].videoPublicId,
                        freePreview: true,
                    },
                ],
                isPublished: true,
            })
        )
    );

    console.log("Cloudinary assets cleared and seed assets uploaded.");
    console.log("Previous LMS data removed.");
    console.log(`Seeded 2 instructors, 2 students, and 1 admin.`);
    console.log(`Seeded ${courses.length} published courses.`);
    console.log(`Admin account: ${admin.userEmail}`);
    console.log("Seed account password: Password123!");
};

seedDatabase()
    .catch((error) => {
        console.error("Unable to seed the database:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
