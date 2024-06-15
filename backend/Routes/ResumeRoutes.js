const ResumeRoutes =require('express').Router()
const path = require('path')
const fs  =  require('fs')
const { uploadResume, getResumes, deleteResume } = require('../controller/Resume/ResumeController')
 
const  multer =require('multer')
 const storage =multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null,"./uploads")
    },
    filename:function(req,file,cb){
        return cb(null,`${file.originalname}_${Date.now()}`)
    }
 })
 
 const upload =multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 2MB
    
  })


ResumeRoutes.post('/upload',upload.single('resumefile'),uploadResume)
ResumeRoutes.get('/getall/:email',getResumes)
ResumeRoutes.delete('/delete',deleteResume)

// New route to view resume
ResumeRoutes.get('/view/:email/:filename', (req, res) => {
  const { email, filename } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', err);
      return res.status(404).json({ error: 'File not found' });
    }

    res.sendFile(filePath);
  });
});


module.exports =ResumeRoutes