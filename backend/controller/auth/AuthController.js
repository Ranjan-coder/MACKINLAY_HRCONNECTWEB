const User = require("../../model/users/UserModel");
const Otp = require("../../model/UserOtp")
const sendUserOtpEmail = require("../../services/jobSeekerEmailService")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { uploadonCloudinary } = require("../../utility/cloudinary");
const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const UserSession = require("../../model/users/UserSession");

const getUser = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined;

    res.json({ userDetails: user, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkEmail = async(req,res) =>{
  const { email } = req.body;
  const user = await User.findOne({ email }); 
  if (user) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  res.status(200).json({ message: 'Email is available' });
}

const checkPhoneNumberExists = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const existingUserByPhone = await User.findOne({ phone_number: phoneNumber });
    if (existingUserByPhone) {
      return res.json({ available: false }); 
    }
    return res.json({ available: true }); 
  } catch (error) {
    console.error("Error checking phone number existence:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const requestOtp = async (req, res) => {
  const { email } = req.body;
  // console.log('Request received to send OTP to:', email);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // console.log('Generated OTP:', otp);

  // Remove any existing OTP for this email
  await Otp.findOneAndDelete({ email });
  const newOtp = new Otp({ email, otp });
  await newOtp.save();

  try {
    // console.log('Calling sendUserOtpEmail...');
    await sendUserOtpEmail(email, otp);
    // console.log('OTP email sent successfully.');
    res.status(200).json({ msg: 'OTP sent' });
  } catch (error) {
    console.error('Failed to send OTP:', error);
    res.status(500).json({ msg: 'Failed to send OTP', error: error.message });
  }
};


const verifyOtp = async (req,res) =>{
  const { email, otp } = req.body;
  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ msg: 'Invalid OTP' });
  }

  await Otp.findOneAndDelete({ email, otp });
  res.status(200).json({ msg: 'OTP verified' });
}

const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone_number,
      dob,
      country,
      state,
      college,
      course,
      course_start_date,
      course_end_date,
      percentage,
      job_title,
      company,
      company_start_date,
      company_end_date,
    } = req.body;
    const resumeFileName = req.file;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `${email} is already registered` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Adjust company_end_date to null if received as "null" from the frontend
    const adjustedCompanyEndDate =
      company_end_date === "null" ? null : company_end_date;

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone_number,
      dob,
      country,
      state,
      college,
      course,
      course_start_date,
      course_end_date,
      percentage,
      job_title: req.body.job_title || null,
      company: req.body.company || null,
      company_start_date: req.body.company_start_date || null,
      company_end_date: adjustedCompanyEndDate,
      profileImage: req.body.profileImage || null,
      biography: req.body.biography || null,
      skills: req.body.skills || null,
      note: req.body.note || null,

      resume: resumeFileName,
      savedJob: [],
      appliedJob: [],
    });
    await newUser.save();

    const newUserSession = new UserSession({
      userId: newUser._id,
      startTime: new Date(),
      endTime: null,
    });
    await newUserSession.save();

    const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, {
      expiresIn: "2d",
    });

    return res.status(201).json({
      message: `${name} your account is created successfully`,
      token,
      name,
      email,
      resume: resumeFileName,
      savedJob: [],
      appliedJob: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No User Found" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const name = user.name;

    let userSession = await UserSession.findOne({
      userId: user._id,
      endTime: null,
    });
    if (!userSession) {
      userSession = new UserSession({
        userId: user._id,
        startTime: new Date(),
        endTime: null,
      });
    } else {
      userSession.startTime = new Date();
    }

    await userSession.save();

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "2d",
    });
    return res.status(200).json({
      message: `${name} you have successfully logged In`,
      token,
      name,
      email,
      userType: "user",
      profileImage: user.profileImage,
      savedJob: user.userSavedJob,
      appliedJob: user.userAppliedJob,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the endTime of the active session for the user
    const session = await UserSession.findOneAndUpdate(
      { userId: user._id, endTime: null },
      { endTime: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User is not registered" });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Reset Password",
      html: `<p>Click <a href="${process.env.CLIENT_URL}/reset-password/${token}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        return res.json({
          status: true,
          message: "Error occured while sending an email",
        });
      } else {
        return res.json({ status: true, message: "email sent" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = await jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserField = async (req, res) => {
  try {
    const { email } = req.params;
    const updateFields = {};
    const result = req.file && (await uploadonCloudinary(req.file.path));
    req.body.profileImage = result && result?.secure_url;

    req.body.skills =
      req.body.skills?.length > 0
        ? req.body.skills
            ?.split(",")
            .map((skill, index) => ({ name: skill.trim(), index }))
        : "";

    for (const key in req.body) {
      if (
        req.body[key] !== "null" &&
        req.body[key] !== "" &&
        req.body[key] !== " " &&
        req.body[key]
      ) {
        updateFields[key] = req.body[key];
      }
    }

    const findUser = await User.findOneAndUpdate(
      { email: email },
      updateFields,
      { new: true }
    );

    if (findUser) {
      res.status(200).json({
        success: true,
        msg: "User details updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        msg: "No user found to update",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getUser,
  checkEmail,
  checkPhoneNumberExists,
  requestOtp,
  verifyOtp,
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updateUserField,
  logout
};
