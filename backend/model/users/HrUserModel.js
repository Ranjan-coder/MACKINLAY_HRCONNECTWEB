const mongoose = require("mongoose");

const hrSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  // jobTitle: {
  //   type: String,
  //   required: true,
  // },
  // department: {
  //   type: String,
  //   required: true,
  // },
  // companyName: {
  //   type: String,
  //   required: true,
  // },
  // experience: {
  //   type: String
  // },
  userType: {
    type: String,
  },
  // course: {
  //   type: String,
  // },
  // gender: {
  //   type: String
  // },
  // website: {
  //   type: String
  // },
  // marital_status: {
  //   type: String
  // },

  // profileImage: {
  //   type: String,
  // },
  // biography: {
  //   type: String,
  // },
  // bookmarkUser: [
  //   {
  //     email: {
  //       type: String,
  //     },
  //     job_title: {
  //       type: String,
  //     }
  //   },
  // ]
});

const HrUser = mongoose.model("HrUser", hrSchema);

module.exports = HrUser;
