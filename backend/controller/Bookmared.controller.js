const bookmarkedCollection = require("../model/BookmaredUser.model");
const HrUser = require("../model/users/HrUserModel");



const createBookmark = async (req, res) => {
    const { HrEmail } = req.params;
    const { email, profileImage, name, jobTitle
        , biography, country, job_title, employmentType, jobDescription, skills, resume, location,_id } = req.body;
    try {

        // Matching the current HR - Email and User - Email with 
        const mongooseResponse = await bookmarkedCollection.create({
             userId:_id,
            employeeEmail: HrEmail,
            email: email,
            Job_title: job_title,
            profileImage,
            name: name,
            biography: biography,
            country: country,
            employmentType: employmentType,
            jobDescription: jobDescription,
            skills: skills,
            resume: resume,
            location: location
        });

        // Update the hr user collection based on the BOOKMARKED USER
        await HrUser.updateOne({ email: HrEmail }, {
            $push: {
                bookmarkUser: {
                    email: email,
                    job_title: jobTitle,
                }
            },
        });
        if (mongooseResponse) {
            return res.status(200).json({
                success: true,
                msg: "User added to bookmarked collection"
            })

        } else {
            return res.status(200).json({
                success: false,
                msg: "Something went wrong, Try again later"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(`Internal server Error : ${error.message}`)
    }

}

const getBookmark = async (req, res) => {
    const { HrEmail } = req.params;

    try {
        const mongooseResponse = await bookmarkedCollection.find({ employeeEmail: HrEmail });

        if (mongooseResponse.length > 0) {
            res.status(200).json({
                success: true,
                bookmarkedUser: mongooseResponse
            })
        } else {
            res.status(200).json({
                success: false,
                bookmarkedUser: mongooseResponse
            })
        }
    } catch (error) {
        res.status(500).send(`Internal server Error : ${error.message}`)
    }
}

const removeBookmark = async (req, res) => {
    try {
      const [employeeEmail, email, Job_title] = req.params.HrEmail.split("-");
    //   console.log(`employeeEmail: ${employeeEmail}, email: ${email}, Job_title: ${Job_title}`);

      // Delete the bookmarked user from the bookmarkedCollection
      const mongooseResponse = await bookmarkedCollection.deleteMany({
        employeeEmail: employeeEmail,
        email: email,
        // Job_title: Job_title,
      });
      // console.log(mongooseResponse);

      // Find the HrUser and update the bookmarkUser array
      const mongooseUser = await HrUser.findOne({ email: employeeEmail });
      // console.log(mongooseUser);
      if (!mongooseUser) {
        return res.status(404).json({
          success: false,
          msg: "HrUser not found",
        });
      }

      // Ensure bookmarkUser is an array
      if (!Array.isArray(mongooseUser.bookmarkUser)) {
        mongooseUser.bookmarkUser = [];
      }

      // Update the bookmarkUser array by filtering out the removed bookmark
      const updatedBookmarkUser = mongooseUser.bookmarkUser.filter(
        (data) => !(data.email === email && data.Job_title === Job_title)
      );

      await HrUser.updateOne(
        { email: employeeEmail },
        { $set: { bookmarkUser: updatedBookmarkUser } }
      );

      return res.status(200).json({
        success: true,
        msg: "User removed from bookmarked collection",
      });
    } catch (error) {
      console.error(`Internal Server Error: ${error.message}`);
      res.status(500).json({
        success: false,
        msg: `Internal server error: ${error.message}`,
      });
    }
  };  

module.exports = {
    createBookmark,
    getBookmark,
    removeBookmark,
}
