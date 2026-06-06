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

    const resume = await Resume.create({
      user: req.user.id,
      name: name || req.file.originalname,
      filePath: req.file.path, // This is the Cloudinary URL
      publicId: req.file.filename, // This is the Cloudinary public ID
      tags: tags ? tags.split(",") : [],
    });

    res.status(201).json({ success: true, data: resume });
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
