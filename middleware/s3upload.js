import multer from 'multer';
import AWS from 'aws-sdk';
import { v1 as uuid } from "uuid";


const s3 = new AWS.S3({
  accessKeyId: process.env.MY_ACCESS_KEY,
  secretAccessKey: process.env.MY_SECRET_KEY,
});

// Set up multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Middleware function for uploading to S3
export const uploadFileToS3 = (req, res, next) => {
  // First, run multer to parse the file
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }
    const uniqueFileName = `${uuid()}`;
    
    // Define S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueFileName, // File name to save in S3
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    
    // Upload the file to S3
    s3.upload(params, (error, data) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error });
      }
      
      // Save the S3 response data to request for later use
      console.log("it came here");
      req.s3Data = data;
      next(); // Proceed to the next middleware
    });
  });
};
