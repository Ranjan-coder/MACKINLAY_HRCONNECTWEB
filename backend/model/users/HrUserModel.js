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
  userType: {
    type: String,
  },
  profileImage: {
    type: String,
  }
});

const HrUser = mongoose.model("HrUser", hrSchema);

module.exports = HrUser;
