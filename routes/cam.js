const express = require('express');
const { camNames } = require('../src/store/camNames.js');

const router = express.Router();

// Index route
const renderIndex = (req, res, camNames) => {
    res.render('index', { camNames: camNames })   // Pass camNames to the index view
}
router.get('/', (req, res) => {
    renderIndex(req, res, camNames)
});  // Pass camNames to the index view

// Dynamic routes for cam views
// @param camId: The camId to render
router.get('/:camId', (req, res) => {
    // Get the camId from the route parameter
    const camId = req.params.camId;
    // Get the camName from the camNames object
    // If the camName does not exist, camName will be undefined
    const camName = camNames[camId];
    // Render the cam view, passing the camId and camName
    // If camName is undefined, the template will render a default message
    res.render('cam', { camId, camName })
})

module.exports = router;