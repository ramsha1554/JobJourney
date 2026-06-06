// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'job-tracker-resumes',
//         allowed_formats: ['pdf', 'doc', 'docx'],
//         resource_type: 'raw' // Required for non-image files like PDF/DOC
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 }
// });

// module.exports = upload;

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const getStorage = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'job-tracker-resumes',
      allowed_formats: ['pdf', 'doc', 'docx'],
      resource_type: 'raw',
    },
  });
};

const upload = multer({
  storage: getStorage(),
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = upload;
