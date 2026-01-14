const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        const { name, tags } = req.body;

        const resume = await Resume.create({
            user: req.user.id,
            name: name || req.file.originalname,
            filePath: req.file.path,
            tags: tags ? tags.split(',') : []
        });

        res.status(201).json({ success: true, data: resume });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: resumes.length, data: resumes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });

        if (!resume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }

        if (fs.existsSync(resume.filePath)) {
            fs.unlinkSync(resume.filePath);
        }

        await resume.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
