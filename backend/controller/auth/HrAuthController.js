const Hr = require("../../model/users/HrUserModel");
const employerSession = require("../../model/users/EmployerSession");
const User = require("../../model/users/UserModel");
const Otp = require("../../model/Otp");
const jobCollection = require("../../model/Job.Model");
const sendOtpEmail = require("../../services/recruiterEmailService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { uploadonCloudinary } = require("../../utility/cloudinary");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

function precedence(operator) {
  if (operator === 'NOT') return 3;
  if (operator === 'AND') return 2;
  if (operator === 'OR') return 1;
  return 0;
}

function applyOperator(operator, right, left) {
  if (operator === 'AND') {
    return { $and: [left, right] };
  }
  if (operator === 'OR') {
    return { $or: [left, right] };
  }
  if (operator === 'NOT') {
    return { $nor: [right] };
  }
  throw new Error(`Unknown operator: ${operator}`);
}

const searchCandidates = async (req, res) => {
  try {
    const { keyword, mandatoryKeywords, excludedKeywords, booleanQuery, ...filters } = req.query;
    let query = {};

    if (booleanQuery) {
      const booleanGroups = booleanQuery.split(',').map(group => group.trim());

      const groupQueries = booleanGroups.map(group => {
        const booleanExpression = group.match(/(?:[^\s()]+|\(|\))/g);
        const queryStack = [];
        const operatorStack = [];

        booleanExpression.forEach(token => {
          if (token === 'AND' || token === 'OR' || token === 'NOT') {
            while (
              operatorStack.length &&
              precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)
            ) {
              queryStack.push(applyOperator(operatorStack.pop(), queryStack.pop(), queryStack.pop()));
            }
            operatorStack.push(token);
          } else if (token === '(') {
            operatorStack.push(token);
          } else if (token === ')') {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
              queryStack.push(applyOperator(operatorStack.pop(), queryStack.pop(), queryStack.pop()));
            }
            operatorStack.pop();
          } else {
            queryStack.push({ job_title: { $regex: new RegExp(token, 'i') } });
          }
        });

        while (operatorStack.length) {
          queryStack.push(applyOperator(operatorStack.pop(), queryStack.pop(), queryStack.pop()));
        }

        return queryStack.pop();
      });

      query.$and = groupQueries;
    } else {
      const andConditions = [];

      if (keyword) {
        const keywords = keyword.split(',').map(word => word.trim());
        query.$or = keywords.map(word => ({ job_title: { $regex: new RegExp(word, 'i') } }));
      }

      if (mandatoryKeywords) {
        const mandatoryKeywordsArray = mandatoryKeywords.split(',').map(word => word.trim());
        query.$and = mandatoryKeywordsArray.map(word => ({
          $or: [
            { job_title: { $regex: new RegExp(word, 'i') } },
            { company: { $regex: new RegExp(word, 'i') } },
            { course: { $regex: new RegExp(word, 'i') } }
          ]
        }));
      }

      if (excludedKeywords) {
        const excludedKeywordsArray = excludedKeywords.split(',').map(word => word.trim());
        query.$nor = excludedKeywordsArray.map(word => ({ job_title: { $regex: new RegExp(word, 'i') } }));
      }
    }

    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey]) {
        if (filterKey === 'experience') {
          query[filterKey] = { $eq: filters[filterKey] };
        } else {
          query[filterKey] = filters[filterKey];
        }
      }
    });

    // console.log('Constructed Query:', JSON.stringify(query, null, 2));
    const profiles = await User.find(query);
    // console.log('Profiles Found:', profiles);

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ error: "No profiles found matching query" });
    }

    return res.status(200).json({ profiles });
  } catch (error) {
    console.error('Error searching candidates:', error);
    res.status(500).json({ error: error.message });
  }
};



const getHR = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await Hr.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ hrDetails: user, success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const checkEmail = async (req, res) => {
  const { email } = req.body;
  const user = await Hr.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Email already registered" });
  }
  res.status(200).json({ message: "Email is available" });
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
    // console.log('Calling sendOtpEmail...');
    await sendOtpEmail(email, otp);
    // console.log('OTP email sent successfully.');
    res.status(200).json({ msg: "OTP sent" });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res.status(500).json({ msg: "Failed to send OTP", error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  await Otp.findOneAndDelete({ email, otp });
  res.status(200).json({ msg: "OTP verified" });
};

const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      aboutCompany,
      companyAddress,
      companyWebsite,
    } = req.body;

    // Check if email is already registered
    const existingHr = await Hr.findOne({ email });
    if (existingHr) {
      return res
        .status(400)
        .json({ message: `${email} is already registered` });
    }

    // Validate email domain
    const domain = email.split("@")[1];
    const genericDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
    ];
    if (genericDomains.includes(domain)) {
      return res
        .status(400)
        .json({ message: "Please use your company email address" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new HR
    const newHr = new Hr({
      name,
      email,
      password: hashedPassword,
      companyName: req.body.companyName || "",
      aboutCompany: req.body.aboutCompany || "",
      companyAddress: req.body.companyAddress || "",
      companyWebsite: req.body.companyWebsite || "",
    });
    await newHr.save();

    const newUserSession = new employerSession({
      userId: newHr._id,
      startTime: new Date(),
      endTime: null,
    });
    await newUserSession.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newHr._id }, SECRET_KEY, {
      expiresIn: "2d",
    });

    return res.status(201).json({
      message: `${name} your account is created successfully`,
      token,
      name,
      email,
      bookmarkUser: [],
      userType: "employee",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email domain
    const domain = email.split("@")[1];
    const genericDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
    ];
    if (genericDomains.includes(domain)) {
      return res
        .status(400)
        .json({ message: "Please use your company email address" });
    }

    // Check if user exists
    const hr = await Hr.findOne({ email });
    if (!hr) {
      return res.status(404).json({ message: "No HR Found" });
    }

    // Compare passwords
    const isPasswordValid =  bcrypt.compare(password, hr.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    let userSession = await employerSession.findOne({
      userId: hr._id,
      endTime: null,
    });
    if (!userSession) {
      userSession = new employerSession({
        userId: hr._id,
        startTime: new Date(),
        endTime: null,
      });
    } else {
      userSession.startTime = new Date();
    }

    await userSession.save();

    // Generate JWT token
    const token = jwt.sign({ userId: hr._id }, SECRET_KEY, { expiresIn: "2d" });

    return res.status(201).json({
      message: `${hr.name} you have successfully logged In`,
      token,
      name: hr.name,
      email: hr.email,
      bookmarkUser: hr.bookmarkUser,
      userType: "employee",
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
    const user = await Hr.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the endTime of the active session for the user
    const session = await employerSession.findOneAndUpdate(
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
    const hr = await Hr.findOne({ email });

    if (!hr) {
      return res.json({ message: "HR is not registered" });
    }

    const token = jwt.sign({ userId: hr._id }, SECRET_KEY, { expiresIn: "5m" });

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
      html: `<p>Click <a href="${process.env.CLIENT_URL}/hr/reset-password/${token}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({
          status: true,
          message: "Error occurred while sending an email",
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
    const hrId = decoded.userId;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the HR's password
    await Hr.findByIdAndUpdate(hrId, { password: hashedPassword });

    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const HRupdateUserField = async (req, res) => {
  try {
    const { email } = req.params;
    const updateFields = {};

    // Check if a file is uploaded
    if (req.file) {
      const result = await uploadonCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      req.body.profileImage = result?.secure_url;
    }

    if (req.body.skills) {
      req.body.skills = req.body.skills
        .split(",")
        .map((skill, index) => ({ name: skill.trim(), index }));
    }

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

    const findUser = await Hr.findOneAndUpdate({ email }, updateFields, {
      new: true,
    });

    if (findUser) {
      res.status(200).json({
        success: true,
        msg: "Hr details updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        msg: "No Hr found to update",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Delete HR
const deleteHR = async (req, res) => {
  try {
    const { email } = req.params;
    const deleteHr = await Hr.deleteOne({ email });
    const deleteJobs = await jobCollection.deleteMany({ employeeEmail: email });
    if (deleteHr.acknowledged && deleteJobs.acknowledged) {
      res.send({
        success: true,
        msg: "Account deleted successfully"
      })
    }
    else {
      res.send({
        success: false,
        msg: "Account not found !!"
      })
    }
  } catch (err) {
    res.status(401).json({ success: false }, err);
  }
}

module.exports = {
  searchCandidates,
  checkEmail,
  getHR,
  requestOtp,
  verifyOtp,
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  HRupdateUserField,
  deleteHR,
};
