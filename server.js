const express = require('express');

const app = express();
const port = 4051;  //use project PLZ number

//bodyParser
app.set('view engine', 'ejs');
app.use(express.static('src')); // serve static files from the src directory

//Routes
app.get('/', (req, res) => {  //set url
    res.render('index')
})

const adminRouter = require('./routes/admin');
const camRouter = require('./routes/cam');
const uploadRouter = require('./middleware/upload-router');

app.use('/admin', adminRouter);
app.use('/cam', camRouter);
app.use('/upload-router', uploadRouter); // Forwards to upload-router:l36

//start server
app.listen(port, () => console.log(`Server is running on https://localhost:${port}`));