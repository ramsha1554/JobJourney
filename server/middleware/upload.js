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

// Configure cloudinary lazily so it always reads current env vars.
const upload = multer({
  storage: {
    _handleFile: (req, file, cb) => {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      storage._handleFile(req, file, cb);
    },
    _removeFile: (req, file, cb) => {
      storage._removeFile(req, file, cb);
    },
  },
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = upload;
