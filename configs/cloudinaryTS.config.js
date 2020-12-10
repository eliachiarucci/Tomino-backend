const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const dynamicStorage = (folder) => {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folder,
        allowedFormats: ["json", "bin"], // The allowed formats of files to upload to cloudinary.
        use_filename: true, // Give the file a name to refer to when uploading to cloudinary.
        unique_filename: false,
        resource_type: "auto",
        overwrite: true,
        public_id: (req, file) => file.originalname.split(".")[0]
      },
      filename: function (req, file, cb) {
      cb(undefined, file.originalname );
    }
    });
    const upload = multer({ storage }).fields([{name: "model.json", maxCount: 1}, {name:"model.weights.bin", maxCount: 1}]);
    return upload;
  }


module.exports = dynamicStorage;