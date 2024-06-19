const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  limits: {fileSize: 5 * 2400 * 1600},
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".mp4" &&
      ext !== ".mkv" &&
      ext !== ".jpeg" &&
      ext !== ".jpg" &&
      ext !== ".png" &&
      ext !== ".webm"
    ) {
      cb(new Error("file type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
