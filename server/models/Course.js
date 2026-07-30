const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    freePreview: {
        type: Boolean,
        default: false,
    },
});

const CourseSchema = new mongoose.Schema({
    instructorId: {
        type: String,
        required: true,
    },
    instructorName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    primaryLanguage: {
        type: String,
        required: true,
    },
    subtitle: String,
    description: String,
    image: {
        type: String,
        required: true,
    },
    welcomeMessage: String,
    pricing: {
        type: Number,
        required: true,
    },
    objectives: String,
    students: [
        {
            studentId: String,
            studentName: String,
            studentEmail: String,
            paidAmount: String,
        },
    ],
    curriculum: [LectureSchema],
    isPublished: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Course", CourseSchema);
