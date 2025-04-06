/* Upload route to handle the upload of media files */
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();
// Define upload directory
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

// Define upload middleware to use the defined storage
const upload = multer({ storage });

// Function to handle file upload via ws
function broadcastUpdate(wss, camId, fileType) {
    if (!wss) {
        console.error('No websocket server found');
        return;
    };

    const message = JSON.stringify({ action: "update", camId, fileType });
    // DEBUG:
    console.log('Broadcasting update for camId:', camId, fileType);

    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}

router.post('/', upload.any(), (req, res) => {
    // Check if files were uploaded
    if (!req.files || !req.files.length === 0) {
        // No files uploaded
        res.status(400).send('No files uploaded');
    }
    // Extract WebSocket instance from request
    const wss = req.app.get("wss");

    req.files.forEach(file => {
        // Get camId from file input
        const camId = file.fieldname;
        // Get file type from file input
        const fileType = file.mimetype;
        // Broadcast update to all clients
        broadcastUpdate(wss, camId, fileType);
    });

    res.status(200).send('Files uploaded successfully');
});

module.exports = router;