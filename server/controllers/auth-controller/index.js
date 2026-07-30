const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { userName, userEmail, password } = req.body;

        if (!userName || !userEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        const existingUser = await User.findOne({
            $or: [{ userEmail }, { userName }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User name or user email already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            userEmail,
            // Public registration must never grant elevated privileges.
            role: "student",
            password: hashPassword,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { userEmail, password } = req.body;

        const checkUser = await User.findOne({ userEmail });

        if (
            !checkUser ||
            !(await bcrypt.compare(password, checkUser.password))
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const accessToken = jwt.sign(
            {
                _id: checkUser._id,
                userName: checkUser.userName,
                userEmail: checkUser.userEmail,
                role: checkUser.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "120m" }
        );

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                accessToken,
                user: {
                    _id: checkUser._id,
                    userName: checkUser.userName,
                    userEmail: checkUser.userEmail,
                    role: checkUser.role,
                },
            },
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login",
        });
    }
};

module.exports = { registerUser, loginUser };
