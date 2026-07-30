const StudentCourses = require("../../models/StudentCourses");

const getCoursesByStudentId = async (req, res) => {
    try {
        const studentBoughtCourses = await StudentCourses.findOne({
            userId: req.user._id,
        });

        res.status(200).json({
            success: true,
            data: studentBoughtCourses?.courses || [],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred",
        });
    }
};

module.exports = { getCoursesByStudentId };
