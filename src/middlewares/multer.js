const multer = require("multer");
const fs = require("fs");

const thumbnailVideoHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(`${__dirname}/../../public/images`)) {
        fs.mkdirSync(`${__dirname}/../../public/images`, { recursive: true });
      }
      cb(null, `${__dirname}/../../public/images`);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_VIDEO_THUMBNAIL_" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const thumbnailSeriesHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(`${__dirname}/../../public/images`)) {
        fs.mkdirSync(`${__dirname}/../../public/images`, { recursive: true });
      }
      cb(null, `${__dirname}/../../public/images`);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_SERIES_THUMBNAIL_" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const deleteFile = (filePath) => {
  if (!fs.existsSync(filePath))
    return "Image File not found, but data was deleted!";
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
      return `Internal error when deleting file: ${err}`;
    } else {
      console.log("File deleted");
      return "Image File deleted succesfully";
    }
  });
};

module.exports = { thumbnailVideoHandler, thumbnailSeriesHandler, deleteFile };
