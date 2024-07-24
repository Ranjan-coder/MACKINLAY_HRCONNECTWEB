const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  conf_password: {
    type: String,
  },
  phone_number: {
    type: String,
    unique: true,
    sparse: true,
  },
  dob: {
    type: Date,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city:{
    type: String,
  },
  college: {
    type: String,
  },
  course: {
    type: String,
  },
  course_start_date: {
    type: Date,
  },
  course_end_date: {
    type: Date,
  },
  percentage: {
    type: Number,
  },
  job_title: {
    type: String,
  },
  company: {
    type: String,
  },
  company_start_date: {
    type: Date,
  },
  company_end_date: {
    type: Date,
  },
  experience: {
    type: String,
  },
  stillWorking: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
  },
  website: {
    type: String,
  },
  marital_status: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  biography: {
    type: String,
  },
  skills: [
    {
      name: { type: String },
      index: { type: Number },
    },
  ],
  note: {
    type: String,
  },
  resume: [
    {
      filename: String,
      url: String,
      public_id: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  userType: {
    type: String,
  },
  userAppliedJob: [
    {
      jobID: {
        type: String,
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  userSavedJob: [
    {
      jobID: {
        type: String,
      },
    },
  ],
});

// Method to calculate dynamic experience
userSchema.methods.calculateExperience = function () {
  if (this.stillWorking) {
    const startDate = new Date(this.company_start_date);
    const endDate = new Date();
    const diffTime = Math.abs(endDate - startDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    const lowerYear = Math.floor(diffMonths / 12);
    const upperYear = lowerYear + 1;
    return diffMonths % 12 === 0
      ? `${lowerYear} year${lowerYear !== 1 ? "s" : ""}`
      : `${lowerYear} - ${upperYear} years`;
  } else if (this.company_start_date && this.company_end_date) {
    const startDate = new Date(this.company_start_date);
    const endDate = new Date(this.company_end_date);
    const diffTime = Math.abs(endDate - startDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    const lowerYear = Math.floor(diffMonths / 12);
    const upperYear = lowerYear + 1;
    return diffMonths % 12 === 0
      ? `${lowerYear} year${lowerYear !== 1 ? "s" : ""}`
      : `${lowerYear} - ${upperYear} years`;
  }
  return "0 years";
};

userSchema.pre("save", function (next) {
  this.experience = this.calculateExperience();
  next();
});

userSchema.index({ job_title: "text", "skills.name": "text" });

const User = mongoose.model("User", userSchema);
module.exports = User;
