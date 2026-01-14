const JobApplication = require('../models/JobApplication');

exports.getJobs = async (req, res) => {
    try {
        const jobs = await JobApplication.find({ user: req.user.id })
            .populate('resume')
            .populate('contact')
            .sort({ columnOrder: 1, createdAt: -1 });

        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getJob = async (req, res) => {
    try {
        const job = await JobApplication.findOne({ _id: req.params.id, user: req.user.id })
            .populate('resume')
            .populate('contact');

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        req.body.user = req.user.id;

        // Clean up empty strings for ObjectIds
        if (req.body.resume === '') delete req.body.resume;
        if (req.body.contact === '') delete req.body.contact;

        const job = await JobApplication.create(req.body);

        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        let job = await JobApplication.findOne({ _id: req.params.id, user: req.user.id });

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        if (req.body.status && req.body.status !== job.status) {
            req.body.history = [...job.history, { status: req.body.status, changedAt: new Date() }];
        }

        // Clean up empty strings for ObjectIds
        if (req.body.resume === '') delete req.body.resume;
        if (req.body.contact === '') delete req.body.contact;

        job = await JobApplication.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await JobApplication.findOne({ _id: req.params.id, user: req.user.id });

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        await job.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
