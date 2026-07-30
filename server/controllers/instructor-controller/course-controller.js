const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
    try {
        if (req.user.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Instructor access required",
            });
        }
        const courseData = req.body;
        courseData.instructorId = req.user._id;
        courseData.instructorName = req.user.userName;
        const newlyCreatedCourse = new Course(courseData);
        const saveCourse = await newlyCreatedCourse.save();

        if (saveCourse) {
            res.status(201).json({
                success: true,
                message: "Course saved successfully",
                data: saveCourse,
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "An error occurred",
        });
    }
};

const getAllCourses = async (req, res) => {
    try {
        if (req.user.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Instructor access required",
            });
        }
        const coursesList = await Course.find({ instructorId: req.user._id });

        res.status(200).json({
            success: true,
            data: coursesList,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "An error occurred",
        });
    }
};

const getCourseDetailsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const courseDetails = await Course.findOne({
            _id: id,
            instructorId: req.user._id,
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found!",
            });
        }

        res.status(200).json({
            success: true,
            data: courseDetails,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "An error occurred",
        });
    }
};

const updateCourseByID = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourseData = req.body;

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: id, instructorId: req.user._id },
            updatedCourseData,
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found!",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "An error occurred",
        });
    }
};

module.exports = {
    addNewCourse,
    getAllCourses,
    updateCourseByID,
    getCourseDetailsByID,
};
