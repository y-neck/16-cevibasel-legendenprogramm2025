const express = require('express');

const http = require('http');   // Required for websockets
const WebSocket = require('ws');

const app = express();
const port = 4051;
/* Websocket server */
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// bodyParser
app.set('view engine', 'ejs');
app.use(express.static('src')); // serve static files from the src directory

// Routes
app.get('/', (req, res) => {  // set url
    res.render('index')
})

// Import routes
const adminRouter = require('./routes/admin');
const camRouter = require('./routes/cam');
const uploadRouter = require('./middleware/upload-router');

app.use('/admin', adminRouter);
app.use('/cam', camRouter);

/* Websocket config */
// Store websocket server in app
app.set('wss', wss);

// Handle ws connection
wss.on('connection', (ws) => {
    console.log('Websocket connection established');
});
// Use upload router to handle file uploads
app.use('/upload-router', uploadRouter); // Forwards to https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/ea6170b83e4ad5425b676032edd45a569c7632bb/middleware/upload-router.js#L37-L38

/* Start server */
app.listen(port, () => console.log(`Server is running on https://localhost:${port}`));