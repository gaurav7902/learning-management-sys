const express = require("express");
const {
    getStudentViewCourseDetails,
    getAllStudentViewCourses,
    checkCoursePurchaseInfo,
} = require("../../controllers/student-controller/course-controller");
const router = express.Router();
const authenticate = require("../../middleware/auth-middleware");

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", getStudentViewCourseDetails);
router.get(
    "/purchase-info/:id/:studentId",
    authenticate,
    checkCoursePurchaseInfo
);

module.exports = router;
