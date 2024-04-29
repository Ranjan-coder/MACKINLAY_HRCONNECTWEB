const User = require("../../model/users/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { uploadonCloudinary } = require("../../utility/cloudinary")
const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const getUser = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userDetails: user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

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
      company_end_date: req.body.company_end_date || null,
      profileImage: req.body.profileImage || null,
      biography: req.body.biography || null,
      skills: req.body.skills || null,
      note: req.body.note || null,

      resume: resumeFileName,
      savedJob: [],
      appliedJob: [],
    });
    await newUser.save();

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
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "2d",
    });
    return res.status(200).json({
      message: `${name} you have successfully logged In`,
      token,
      name,
      email,
      userType: "user",
      profileImage : user.profileImage,
      savedJob: user.userSavedJob,
      appliedJob: user.userAppliedJob,
    });
  } catch (error) {
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
      html: `<p>Click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password.</p>`,
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
    const result = await uploadonCloudinary(req.file.path);
    const { phone_number, dob, country, course, website, gender, marital_status, biography, experience, skills
    } = req.body;


    // change the skils structure according to the model skils structure
    let updatedSkils = updatedUserData.skills.map((data, index) => ({
      name: data.trim(),
      index,
    }));
    updatedUserData.skills = updatedSkils;

    const skillArray = skills.split(",").map((skill, index) => ({ name: skill.trim(), index }));


    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields with the new data
    Object.assign(user, {
      profileImage: result.secure_url,
      phone_number: phone_number,
      dob: dob,
      country: country,
      course: course,
      website: website,
      gender: gender,
      marital_status: marital_status,
      biography: biography,
      experience: experience,
      skills: skillArray
    });

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user: user.toObject(), // Convert to plain JavaScript object for response
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  getUser,
  updateUserField,
};
