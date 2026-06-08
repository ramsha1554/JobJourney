
const Resume = require("../models/Resume");
const cloudinary = require("cloudinary").v2;

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Please upload a file" });
    }

    const { name, tags } = req.body;

    const filePath =
      req.file?.secure_url || // cloudinary-storage often uses secure_url
      req.file?.url ||
      req.file?.path; // fallback (multer)

    const publicId =
      req.file?.public_id || // cloudinary-storage often uses public_id
      req.file?.filename; // fallback

    // Validate required fields to avoid 500s from Mongoose validation errors
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }
    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: "Missing file URL from upload",
        details: { availableFileKeys: Object.keys(req.file || {}) },
      });
    }

    const resume = await Resume.create({
      user: req.user.id,
      name: name || req.file.originalname,
      filePath,
      publicId,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    });

    return res.status(201).json({ success: true, data: resume });
  } catch (error) {
    console.error("uploadResume failed:", {
      message: error?.message,
      stack: error?.stack,
      // helpful for Cloudinary/multer issues in hosted envs
      file: req.file ? { keys: Object.keys(req.file) } : undefined,
      body: req.body,
    });

    // If it's a validation error, return 400 instead of 500
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Resume validation failed",
        details: error?.errors,
      });
    }

    return res
      .status(500)
      .json({ success: false, error: "Failed to upload resume" });
  }
};

exports.getResumes = async (req, res) => {
  try {
    // Extra safety: protect middleware should have populated req.user
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    const resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error("getResumes failed:", {
      message: error?.message,
      stack: error?.stack,
    });
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch resumes" });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, error: "Resume not found" });
    }

    // Delete from Cloudinary
    if (resume.publicId) {
      await cloudinary.uploader.destroy(resume.publicId, {
        resource_type: "raw",
      });
    }

    await resume.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error("deleteResume failed:", {
      message: error?.message,
      stack: error?.stack,
    });
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete resume" });
  }
};
