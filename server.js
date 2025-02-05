const express = require('express');

const app = express();
const port = 4051;

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
app.use('/upload-router', uploadRouter); // Forwards to https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/ea6170b83e4ad5425b676032edd45a569c7632bb/middleware/upload-router.js#L37-L38

// Start server
app.listen(port, () => console.log(`Server is running on https://localhost:${port}`));