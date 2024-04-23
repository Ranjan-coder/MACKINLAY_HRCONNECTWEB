
const myJobRoutes = require("express").Router();
const { createAppliedJob, getAppliedJob, removeAppliedJob, createSavedJob, getSavedJob, removeSavedJob, getApplicantsForJob } = require("../controller/MyJob.contoller")

myJobRoutes.post("/create/apply-job", createAppliedJob);
myJobRoutes.get("/get/apply-job/:email", getAppliedJob);
myJobRoutes.delete("/delete/apply-job/:email", removeAppliedJob);
myJobRoutes.get('/job/:jobId/applicants', getApplicantsForJob);




myJobRoutes.post("/create/save-job",createSavedJob);
myJobRoutes.get("/get/save-job/:email",getSavedJob);
myJobRoutes.delete("/delete/save-job/:email",removeSavedJob);


module.exports = myJobRoutes;