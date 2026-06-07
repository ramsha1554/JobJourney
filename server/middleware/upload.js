const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job-tracker-resumes",
    allowed_formats: ["pdf", "doc", "docx"],
    resource_type: "raw",
  },
});

const upload = multer({
  storage: {
    _handleFile: (req, file, cb) => {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log("Cloudinary config at runtime:", {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        secret_set: !!process.env.CLOUDINARY_API_SECRET,
      });
      storage._handleFile(req, file, (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
        cb(err, result);
      });
    },
    _removeFile: (req, file, cb) => {
      storage._removeFile(req, file, cb);
    },
  },
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = upload;