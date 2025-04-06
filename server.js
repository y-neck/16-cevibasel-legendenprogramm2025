const express = require('express');

const http = require('http');   // Required for websockets
const WebSocket = require('ws');

const app = express();
const port = 4051;
/* Websocket server */
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.set('wss', wss);

// bodyParser
app.set('view engine', 'ejs');
app.use(express.static('src')); // serve static files from the src directory

/* Routes */
// Distribute camNames.js and file paths from store to frontend
const { camNames } = require('./src/store/camNames.js'); // camNames.js
const fs = require('fs'); // file paths
const path = require('path');

// Index routing
app.get('/', (req, res) => {
    const uploadDir = path.join(__dirname, '../src/upload');
    // Build camera object
    const camMediaTypes = {};
    // Iterate over each camName in camNames.js and check if each cam's corresponding file exists in the upload directory
    Object.keys(camNames).forEach((key, index) => {
        const camId = `cam-${index + 1}`;
        // List of allowed file extensions
        const allowedExtensions = ['jpg', 'jpeg', 'mp4'];
        // Initialize to null, will be set to the found extension
        let foundExt = null;

        // Iterate over each allowed extension
        for (const ext of allowedExtensions) {
            // Construct the full path of the file
            const filePath = path.join(uploadDir, `${camId}.${ext}`);
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                // If it exists, set foundExt to the current extension
                foundExt = ext;
                break;
            }
        }
        camMediaTypes[camId] = foundExt;    // Set camMediaTypes[camId] to the found extension; can be null if no file was found
    })
    // set url
    res.render('index', { camNames, camMediaTypes, renderMediaTag });
})

// Backend routing
app.get('/admin/backend', (req, res) => {  // set url
    res.render('admin/backend', { camNames })
})

// Import routes
const adminRouter = require('./routes/admin');
const camRouter = require('./routes/cam');
const uploadRouter = require('./middleware/upload-router');
const { renderMediaTag } = require('./src/scripts/renderMediaTag.js');

// Attach routers
app.use('/admin', adminRouter);
app.use('/cam', camRouter);
app.use('/upload-router', uploadRouter); // Forwards to https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/ea6170b83e4ad5425b676032edd45a569c7632bb/middleware/upload-router.js#L37-L38

/* Websocket config */
// Handle ws connection
wss.on('connection', (ws) => {
    console.log('Websocket connection established');
});
// Use upload router to handle file uploads

/* Start server with app and websocket */
server.listen(port, () => console.log(`Server is running on https://localhost:${port}`));