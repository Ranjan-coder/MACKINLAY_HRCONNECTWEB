const { uploadonCloudinary } = require("../utility/cloudinary")
const jobCollection = require("../model/Job.Model");

const create = async (req, res) => {

  try {
    const result = await uploadonCloudinary(req.file.path);
    const { jobTitle, jobDescription, employmentType, location, salaryRange, skilRequired, employeeEmail, jobExperience, education, responsibility, howToApply } = req.body;
    const newPost = {
      jobPoster: result.secure_url,
      jobTitle,
      jobDescription,
      employmentType,
      location,
      salaryRange,
      skilRequired,
      employeeEmail,
      jobExperience,
      education, 
      responsibility, 
      howToApply,
      createdAt: Date.now(),
    };
    const mongooseRespoonse = await jobCollection.create(newPost)
    if (mongooseRespoonse) {
      res.status(200).json({
        success: true,
      })
    }
    else {
      res.status(404).json({
        success: false,
      })
    }
    // res.json({ message: 'Post created successfully!', newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

const getJobByID = async (req, res) => {
  try {
    const jobs = await jobCollection.findById(req.params.id);
    if (jobs) {
      res.status(200).send({ jobs, success: true });
    } else {
      res.status(404).send({ jobs: "No job found", success: false });

    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error, success: false });
  }
};

const get = async (req, res) => {
  try {
    const jobs = await jobCollection.find({ employeeEmail: req.params.email });

    if (jobs) {
      res.status(200).send({ jobs, success: true });
    } else {
      res.status(404).send({ jobs: "No job found", success: false });

    }
  } catch (error) {
    res.status(500).json({ error, success: false });
  }
};

const getAll = async (req, res) => {
  try {
    const mongooseResponse = await jobCollection.find({});

    if (mongooseResponse.length === 0) {

      res.status(404).send({ job: "No job found", success: false });
    } else {
      res.status(200).send({ jobs: mongooseResponse, success: true });
    }
  } catch (error) {
    res.status(500).json({ error, success: false });
  }
};

const update = async (req, res) => {
  try {
    const data = await jobCollection.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );

    res.status(200).send({ job: data, success: true });
  } catch (error) {
    res.status(500).json({ error, success: false });
  }
};

const remove = async (req, res) => {

  try {
    const data = await jobCollection.findByIdAndDelete(req.params.id);

    if (data) {

      res.status(200).send({ job: data, success: true });
    } else {
      res.status(404).send({ job: "No job found", success: false });

    }
  } catch (error) {
    res.status(500).json({ error, success: false });
  }
};

module.exports = {
  create,
  get,
  update,
  remove,
  getAll,
  getJobByID
};