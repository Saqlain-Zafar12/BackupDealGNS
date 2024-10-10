const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../utils/s3');

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,  // Automatically sets the correct Content-Type
    // acl: 'public-read' 
  })
});

module.exports = upload;