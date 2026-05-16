const JobApplication = require('../models/JobApplication');
const Resume = require('../models/Resume');
const { analyzeMatch } = require('../utils/aiService');
const { extractTextFromUrl } = require('../utils/parser');

exports.analyzeJobMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await JobApplication.findOne({ _id: id, user: req.user.id }).populate('resume');

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        if (!job.resume) {
            return res.status(400).json({ success: false, error: 'No resume linked to this job application' });
        }

        // 1. Extract Text from Resume
        const resumeText = await extractTextFromUrl(job.resume.filePath);

        // 2. Prepare Job Description
        const jd = `Title: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description || job.notes || ''}`;

        // 3. Call AI Service
        const analysis = await analyzeMatch(resumeText, jd);

        // 4. Update Job with Analysis
        job.aiAnalysis = {
            ...analysis,
            analyzedAt: new Date()
        };

        await job.save();

        res.status(200).json({ success: true, data: job.aiAnalysis });
    } catch (error) {
        console.error('Analysis Route Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
