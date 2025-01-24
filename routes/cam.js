const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
})

// Dynamic routes for cam views
router
    .route('/:camId')
    .get((req, res) => {
        req.params.camId
        res.send(`Cam page ${req.params.camId}`)
    })

module.exports = router;