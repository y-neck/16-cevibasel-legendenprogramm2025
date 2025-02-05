/* Upload route to handle the upload of media files */
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const uploadDir = path.join(__dirname, '../src/upload');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Rename files to input field id via multer
// https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
    destination: uploadDir, // Upload directory
    filename: (req, file, cb) => {
        const camId = file.fieldname
        const ext = path.extname(file.originalname) // Get file extension
        const newFilename = `${camId}${ext}`; // Return filename consisting of camId and extension

        // Delete old file via overwrite if it exists 
        const filePath = path.join(uploadDir, newFilename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        cb(null, newFilename);  // Return new filename
    }
});

// Upload middleware
const upload = multer({ storage });

router.post('/', upload.any(), (req, res) => {
    // Check if files were uploaded
    if (!req.files || !req.files.length === 0) {
        // No files uploaded
        res.status(400).send('No files uploaded');
    }
    res.status(200).send('Files uploaded successfully');
});

module.exports = router;