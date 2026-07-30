const cloudinary = require("cloudinary").v2;

//configure with env data
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            ...options,
        });

        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Error uploading to Cloudinary");
    }
};

const clearCloudinaryAssets = async () => {
    try {
        await Promise.all([
            cloudinary.api.delete_all_resources({
                resource_type: "image",
                type: "upload",
                invalidate: true,
            }),
            cloudinary.api.delete_all_resources({
                resource_type: "video",
                type: "upload",
                invalidate: true,
            }),
        ]);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to clear Cloudinary assets");
    }
};

const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to delete asset from Cloudinary");
    }
};

module.exports = {
    uploadMediaToCloudinary,
    deleteMediaFromCloudinary,
    clearCloudinaryAssets,
};
