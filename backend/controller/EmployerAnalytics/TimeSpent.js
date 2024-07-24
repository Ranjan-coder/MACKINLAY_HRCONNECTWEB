const employerSession = require("../../model/users/EmployerSession");
const HrUser = require("../../model/users/HrUserModel");

const calculateTimePeriod = (period) => {
  const today = new Date();
  switch (period) {
    case "weekly":
      const startOfThisWeek = new Date(today);
      startOfThisWeek.setDate(
        startOfThisWeek.getDate() - startOfThisWeek.getDay()
      );
      const endOfThisWeek = new Date(startOfThisWeek);
      endOfThisWeek.setDate(endOfThisWeek.getDate() + 7);
      return { startTime: { $gte: startOfThisWeek, $lt: endOfThisWeek } }; // Nest under startTime for consistency
    case "monthly":
      const startOfThisMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const endOfThisMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      return { startTime: { $gte: startOfThisMonth, $lt: endOfThisMonth } }; // Nest under startTime for consistency
    case "yearly":
      const startOfThisYear = new Date(today.getFullYear(), 0, 1);
      const endOfThisYear = new Date(today.getFullYear() + 1, 0, 1);
      return { startTime: { $gte: startOfThisYear, $lt: endOfThisYear } }; // Nest under startTime for consistency
    default:
      return {};
  }
};

exports.getWeeklyTimeSpent = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await HrUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const periodFilter = calculateTimePeriod("weekly");
    const timeSpent = await employerSession.aggregate([
      { $match: { userId: user._id, ...periodFilter } },
      {
        $group: {
          _id: null,
          totalTime: { $sum: { $subtract: ["$endTime", "$startTime"] } },
        },
      },
    ]);
    const totalTimeSpent = timeSpent.length > 0 ? timeSpent[0].totalTime : 0;
    const timeSpentInMinutes = Math.floor(totalTimeSpent / (1000 * 60));

    res.json({ timeSpent: timeSpentInMinutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMonthlyTimeSpent = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await HrUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const periodFilter = calculateTimePeriod("monthly");
    const timeSpent = await employerSession.aggregate([
      { $match: { userId: user._id, ...periodFilter } },
      {
        $group: {
          _id: null,
          totalTime: { $sum: { $subtract: ["$endTime", "$startTime"] } },
        },
      },
    ]);
    const totalTimeSpent = timeSpent.length > 0 ? timeSpent[0].totalTime : 0;
    const timeSpentInMinutes = Math.floor(totalTimeSpent / (1000 * 60));

    res.json({ timeSpent: timeSpentInMinutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getYearlyTimeSpent = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await HrUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const periodFilter = calculateTimePeriod("yearly");
    const timeSpent = await employerSession.aggregate([
      { $match: { userId: user._id, ...periodFilter } },
      {
        $group: {
          _id: null,
          totalTime: { $sum: { $subtract: ["$endTime", "$startTime"] } },
        },
      },
    ]);
    const totalTimeSpent = timeSpent.length > 0 ? timeSpent[0].totalTime : 0;
    const timeSpentInMinutes = Math.floor(totalTimeSpent / (1000 * 60));

    res.json({ timeSpent: timeSpentInMinutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
