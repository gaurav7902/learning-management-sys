const express = require("express");
const {
    getCoursesByStudentId,
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();
const authenticate = require("../../middleware/auth-middleware");

router.get("/get/:studentId", authenticate, getCoursesByStudentId);

module.exports = router;
