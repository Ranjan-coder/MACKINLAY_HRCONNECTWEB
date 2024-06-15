const sendInterviewEmail = require('../../utility/mailer.js');
const Interview = require('../../model/InterviewSchedule/InterviewModel.js');

const InterviewScheduleController = async (req, res) => {
    const { userEmail, userName, interviewDetails } = req.body;

    if (!userEmail || !userName || !interviewDetails) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const { interviewDate, interviewTime, interviewType, location } = interviewDetails;

    if (!interviewDate || !interviewTime || !interviewType || !location) {
        return res.status(400).json({ success: false, message: "Missing interview details." });
    }

    const subject = "Interview Scheduled";
    const text = `Dear ${userName},\n\nYour interview has been scheduled on ${interviewDate} at ${interviewTime} at ${location} via ${interviewType}.\n\nBest regards,\nHR Team`;

    try {
        // Send interview email
        await sendInterviewEmail(userEmail, subject, text);

        // Store interview details in the database
        const newInterview = new Interview({
            userEmail,
            userName,
            interviewDate,
            interviewTime,
            interviewType,
            location,
        });

        const savedInterview = await newInterview.save();

        res.status(200).json({ success: true, message: "Interview scheduled and email sent successfully.", data: savedInterview });
    } catch (error) {
        console.error("Error scheduling interview:", error.message);
        res.status(500).json({ success: false, message: "Failed to schedule interview.", error: error.message });
    }
};
const GetCandidate = async (req, res) => {
    try {
        const candidates = await Interview.find({});
        res.status(200).json({ success: true, data: candidates });
    } catch (error) {
        console.error("Error fetching candidates:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch candidates.", error: error.message });
    }
};


module.exports = { InterviewScheduleController,GetCandidate};