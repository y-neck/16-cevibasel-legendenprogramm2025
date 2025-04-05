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
// Distribute camNames.js from store to frontend
const { camNames } = require('./src/store/camNames.js');

app.get('/', (req, res) => {  // set url
    res.render('index', { camNames })
})
app.get('/admin/backend', (req, res) => {  // set url
    res.render('admin/backend', { camNames })
})

// Import routes
const adminRouter = require('./routes/admin');
const camRouter = require('./routes/cam');
const uploadRouter = require('./middleware/upload-router');

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