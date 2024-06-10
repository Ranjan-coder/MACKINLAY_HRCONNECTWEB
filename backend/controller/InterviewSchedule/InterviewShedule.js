const nodemailer=require('nodemailer')

const InterviewController=async (req, res) => {
    const { candidateName, candidateEmail, interviewType, interviewDate, interviewTime, interviewerName, location, description } = req.body;
  
    // Configure the email transport using Nodemailer
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host:'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
  
    // Email content
    let mailOptions = {
      from: process.env.EMAIL_ID,
      to: candidateEmail,
      subject: 'Interview Schedule',
      text: `Dear ${candidateName},\n\nYou have been scheduled for an interview.\n\nDetails:\nType: ${interviewType}\nDate: ${interviewDate}\nTime: ${interviewTime}\nInterviewer: ${interviewerName}\nLocation: ${location}\nDescription: ${description}\n\nBest regards,\nCompany`
    };
  
    // Send the email
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response); // Log the response
      res.status(200).send('Interview scheduled and email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error); // Log any errors
      res.status(500).send('Error in scheduling interview or sending email');
    }
  }
  module.exports={InterviewController};