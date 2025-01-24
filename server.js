const express = require('express');

const app = express();
const port = 4051;  //use project PLZ number

//bodyParser
app.set('view engine', 'ejs');

//Routes
app.get('/', (req, res) => {  //set url
    res.render('index')
})

//start server
app.listen(port, () => console.log(`Server is running on https://localhost:${port}`));