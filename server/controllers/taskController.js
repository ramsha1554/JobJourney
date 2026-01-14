const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).populate('job', 'title company');
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        await task.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
