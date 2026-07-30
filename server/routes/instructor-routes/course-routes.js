const express = require("express");
const {
    addNewCourse,
    getAllCourses,
    getCourseDetailsByID,
    updateCourseByID,
} = require("../../controllers/instructor-controller/course-controller");
const router = express.Router();
const authenticate = require("../../middleware/auth-middleware");

router.use(authenticate);
router.use((req, res, next) => {
    if (req.user.role !== "instructor") {
        return res
            .status(403)
            .json({ success: false, message: "Instructor access required" });
    }
    next();
});

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

module.exports = router;
