const express = require("express");
const multer = require("multer");
const fs = require("fs/promises");
const os = require("os");
const {
    uploadMediaToCloudinary,
    deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();
const authenticate = require("../../middleware/auth-middleware");

const upload = multer({
    // dest: "uploads/",
    // Vercel functions can write only to their temporary directory.
    dest: os.tmpdir(),
    limits: { fileSize: 100 * 1024 * 1024 },
});

router.use(authenticate);
router.use((req, res, next) => {
    if (req.user.role !== "instructor") {
        return res
            .status(403)
            .json({ success: false, message: "Instructor access required" });
    }
    next();
});

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file)
            return res
                .status(400)
                .json({ success: false, message: "A file is required" });
        const result = await uploadMediaToCloudinary(req.file.path);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            success: false,
            message: "Error uploading file",
        });
    } finally {
        if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Asset ID is required",
            });
        }

        await deleteMediaFromCloudinary(id);

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully from Cloudinary",
        });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            success: false,
            message: "Error deleting file",
        });
    }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
    try {
        if (!req.files?.length)
            return res.status(400).json({
                success: false,
                message: "At least one file is required",
            });
        const uploadPromises = req.files.map((fileItem) =>
            uploadMediaToCloudinary(fileItem.path)
        );

        const results = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (event) {
        console.log(event);

        res.status(500).json({
            success: false,
            message: "Error in bulk uploading files",
        });
    } finally {
        await Promise.all(
            (req.files || []).map((file) =>
                fs.unlink(file.path).catch(() => {})
            )
        );
    }
});

module.exports = router;
