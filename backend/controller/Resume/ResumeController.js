const User = require('../../model/users/UserModel');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadResume = async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find the user by email
    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, create a new user
      user = new User({ email }); // You can add more fields as needed

      // Save the new user document asynchronously
      await user.save();
    }

    // Upload file to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', // Use 'raw' for non-image files like PDFs
        folder: 'resumes',
        public_id: `${file.originalname}_${Date.now()}`,
      },
      async (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return res.status(500).json({ message: 'Cloudinary upload error', error });
        }

        // Append the new resume to the user's resumes array
        user.resume.push({
          filename: result.original_filename,
          url: result.secure_url,
          public_id: result.public_id,
        });

        // Save the updated user document
        await user.save();

        res.status(201).json({ message: 'Resume uploaded successfully', user: user });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
};

const getResumes = async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the resumes array from the user object
    const resumes = user.resume;

    res.status(200).json({ resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { email, public_id } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter out the resume with the matching public_id
    user.resume = user.resume.filter((resume) => resume.public_id !== public_id);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Resume deleted successfully', user: user });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};

module.exports = { uploadResume, getResumes, deleteResume };
