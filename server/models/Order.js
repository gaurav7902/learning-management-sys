const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    paymentId: {
        type: String,
        default: null,
    },
    payerId: {
        type: String,
        default: null,
    },
    instructorId: {
        type: String,
        required: true,
    },
    instructorName: {
        type: String,
        required: true,
    },
    courseImage: {
        type: String,
        required: true,
    },
    courseTitle: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    coursePricing: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Order", OrderSchema);
