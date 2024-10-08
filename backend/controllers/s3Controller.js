const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../utils/s3');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      imageUrl: req.file.location
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file', details: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  const { key } = req.params;

  if (!key) {
    return res.status(400).json({ error: 'Image key is required' });
  }

  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Error deleting image', details: error.message });
  }
};