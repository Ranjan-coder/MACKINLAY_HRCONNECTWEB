const express=require('express');
const { InterviewController } = require('../../controller/InterviewSchedule/InterviewShedule');
const route=express.Router();

route.post("/interViewShedule",InterviewController)

module.exports={route}