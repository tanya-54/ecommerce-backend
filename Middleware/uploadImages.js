const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/products"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(100000 + Math.random() * 900000);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "unsupported File Format" }, false);
  }
};

const productImgResize = async (req, res, next) => {
  
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jp2")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`)
        .fs.unlinkSync(`public/images/products/${file.filename}`);
        console.log('file.path:', file.path)
    })
  );
  next();
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 1024*1024*10 },
});

module.exports = { uploadPhoto, productImgResize };