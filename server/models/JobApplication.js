const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please add a company name'],
        trim: true
    },
    location: {
        type: String,
        default: 'Remote'
    },
    jobUrl: {
        type: String
    },
    salary: {
        type: String
    },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted'],
        default: 'Applied'
    },
    dateApplied: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    notes: {
        type: String
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    history: [{
        status: String,
        changedAt: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    columnOrder: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

JobApplicationSchema.index({ user: 1 });

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
