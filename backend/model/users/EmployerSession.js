const mongoose = require("mongoose");

const employerSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "HrUser", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
}); 

const employerSession = mongoose.model("employerSession", employerSessionSchema);

module.exports = employerSession;
