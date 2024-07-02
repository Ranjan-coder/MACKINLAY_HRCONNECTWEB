const rejectedCollection = require("../model/RejectedUser.model");
const HrUser = require("../model/users/HrUserModel");
const jobCollection = require("../model/Job.Model");


const createReject = async (req, res) => {
    const { HrEmail } = req.params;
    const {
        _id, 
        email,
        profileImage,
        name,
        jobTitle,
        jobID, 
        biography,
        country,
        employmentType,
        jobDescription,
        skills,
        resume,
        location
    } = req.body;

    try {
        // Check if the candidate already exists in rejectedCollection
        const existCandidate = await rejectedCollection.findOne({
            email: email,
            Job_title: jobTitle
        });

        if (existCandidate) {
            // Update the existing candidate's status to 'rejected'
            existCandidate.status = 'Rejected';
            await existCandidate.save();

            // Update the jobCollection to reflect the status change
            await jobCollection.updateOne(
                { employeeEmail:HrEmail,_id:jobID, 'appliedBy.email': email },
                {
                    $set: { 'appliedBy.$.status': 'rejected' },
                }
            );

            return res.status(200).json({
                success: true,
                msg: "User status updated to rejected"
            });
        }

        // Create a new entry in rejectedCollection
        const mongooseResponse = await rejectedCollection.create({
            userId:_id,
            employeeEmail: HrEmail,
            email: email,
            Job_title: jobTitle,
            jobID:jobID,
            profileImage,
            name: name,
            biography: biography,
            jobDescription: jobDescription,
            skills: skills,
            resume: resume,
            location: location,
            country:country,
            employmentType:employmentType,
            status: 'rejected' // Example field for status
        });

        // Update the HrUser collection with the rejected user
        await HrUser.updateOne(
            { email: HrEmail },
            {
                $push: {
                    rejectedUser: {
                        email: email,
                        job_title: jobTitle
                    }
                }
            }
        );

        // Update the jobCollection to reflect the status change
      const updateJobCollection=  await jobCollection.updateOne(
            { employeeEmail:HrEmail,_id:jobID, 'appliedBy.email': email },
            {
                $set: { 'appliedBy.$.status': 'rejected' },
            }
        );

        if (mongooseResponse && updateJobCollection) {
            return res.status(200).json({
                success: true,
                msg: "User added to Rejected collection"
            });
        } else {
            return res.status(200).json({
                success: false,
                msg: "Something went wrong, Try again later"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(`Internal server Error : ${error.message}`);
    }
};
const getRejected = async (req, res) => {
    const { HrEmail } = req.params;

    try {
        const mongooseResponse = await rejectedCollection.find({ employeeEmail: HrEmail });

        if (mongooseResponse.length > 0) {
            res.status(200).json({
                success: true,
                rejectedUser: mongooseResponse
            })
        } else {
            res.status(200).json({
                success: false,
                rejectedUser: mongooseResponse
            })
        }
    } catch (error) {
        res.status(500).send(`Internal server Error : ${error.message}`)
    }
}

const removeRejected = async (req, res) => {

    const [employeeEmail, email, Job_title] = req.params.HrEmail.split("-");
    try {
        const mongooseResponse = await rejectedCollection.deleteMany({
            employeeEmail: employeeEmail,
            email: email,
            Job_title: Job_title,
        });
        const mongooseUser = await HrUser.findOne({ email: employeeEmail });

        await HrUser.updateOne({ email: employeeEmail }, {
            RejectedUser: mongooseUser.RejectedUser.filter((data) => data.email === email).filter((data) => data.job_title !== Job_title)
        });

        if (mongooseResponse) {
            return res.status(200).json({
                success: true,
                msg: "User removed from  rejected collection"
            })

        } else {
            return res.status(200).json({
                success: false,
                msg: "Something went wrong, Try again later"
            })
        }


    } catch (error) {
        res.status(500).send(`Internal server Error : ${error.message}`)
    }
}


module.exports = {
    createReject,
    getRejected,
    removeRejected,
}
