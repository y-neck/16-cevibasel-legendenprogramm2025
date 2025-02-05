const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload-router');

router.get('/', (req, res) => {
    res.render('admin')
})
router.get('/backend', (req, res) => {
    res.render('admin/backend')
})
// POST module for admin backend file upload
router.post('/backend', upload, (req, res) => {
    // Handle the form submission here
    // For example, you can use the req.files array to access the uploaded files
    if (!req.files || !req.files.length === 0) {
        // No files uploaded
        res.status(400).send('No files uploaded');
    } else {
        // Files uploaded successfully
        res.status(200).send('Files uploaded successfully');
    }
})

module.exports = router;