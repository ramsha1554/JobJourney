const JobApplication = require("../models/JobApplication");
const mongoose = require("mongoose");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const statusCounts = await JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {
      total: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Ghosted: 0,
    };

    statusCounts.forEach((item) => {
      stats[item._id] = item.count;
      stats.total += item.count;
    });

    const monthlyApplications = await JobApplication.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            month: { $month: "$dateApplied" },
            year: { $year: "$dateApplied" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    const now = new Date();
    const upcomingInterviews = await JobApplication.aggregate([
      {
        $match: {
          user: userId,
          status: "Interview",
          interviewDate: { $ne: null, $gte: now },
        },
      },
      { $sort: { interviewDate: 1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          title: 1,
          company: 1,
          location: 1,
          interviewDate: 1,
          status: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats,
        monthlyApplications,
        upcomingInterviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
