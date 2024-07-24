const HrRoutes = require("express").Router();

const {
    searchCandidates,
    getHR,
    checkEmail,
    requestOtp,
    verifyOtp,
    signUp,
    login,
    forgotPassword,
    resetPassword,
    HRupdateUserField,
    deleteHR,
    logout
} = require("../controller/auth/HrAuthController");
const { upload, uploadProfile } = require("../middleware/fileUploadMiddleware");

const {
    getWeeklyTimeSpent,
    getMonthlyTimeSpent,
    getYearlyTimeSpent,
  } = require("../controller/EmployerAnalytics/TimeSpent");

HrRoutes.get("/get-hr", getHR);
HrRoutes.post("/check-Email", checkEmail);
HrRoutes.post("/request-otp", requestOtp);
HrRoutes.post("/verify-otp", verifyOtp);
HrRoutes.post("/signup", upload, signUp);
HrRoutes.post("/login", login);
HrRoutes.post("/logout", logout);
HrRoutes.get("/search-candidates", searchCandidates);
HrRoutes.post("/forgot-password", forgotPassword);
HrRoutes.post("/reset-password/:token", resetPassword);
HrRoutes.patch("/update-hr/:email", uploadProfile, HRupdateUserField);
HrRoutes.delete("/delete-hr/:email", deleteHR)
HrRoutes.get("/analytics/time-spent/weekly", getWeeklyTimeSpent);
HrRoutes.get("/analytics/time-spent/monthly", getMonthlyTimeSpent);
HrRoutes.get("/analytics/time-spent/yearly", getYearlyTimeSpent);

module.exports = HrRoutes;
