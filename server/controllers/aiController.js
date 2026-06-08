const JobApplication = require("../models/JobApplication");
const Resume = require("../models/Resume");
const {
  analyzeMatch,
  generateInterviewQuestions,
} = require("../utils/aiService");
const { extractTextFromUrl } = require("../utils/parser");

exports.analyzeJobMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await JobApplication.findOne({
      _id: id,
      user: req.user.id,
    }).populate("resume");
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found for this user" });
    }
    if (!job.resume) {
      return res.status(400).json({ success: false, error: "No resume linked to this job application" });
    }
    const resumeText = await extractTextFromUrl(job.resume.filePath);
    const jd = `Title: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description || job.notes || ""}`;
    const analysis = await analyzeMatch(resumeText, jd);
    job.aiAnalysis = { ...analysis, analyzedAt: new Date() };
    await job.save();
    res.status(200).json({ success: true, data: job.aiAnalysis });
  } catch (error) {
    console.error("Analysis Route Error:", error);
    const status = error?.message?.includes("quota") || error?.status === 429 ? 429 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

exports.generateInterviewQuestionsHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await JobApplication.findOne({ _id: id, user: req.user.id });
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found for this user" });
    }
    const jobDescription = `Title: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description || job.notes || ""}`;
    const questions = await generateInterviewQuestions(job.title, job.company, jobDescription);
    res.status(200).json({ success: true, data: { questions } });
  } catch (error) {
    console.error("Questions Route Error:", error);
    const status = error?.message?.includes("quota") || error?.status === 429 ? 429 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};
