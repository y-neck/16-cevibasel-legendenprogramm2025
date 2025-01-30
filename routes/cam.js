const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
})

// Dynamic routes for cam views
router.get('/:camId', (req, res) => {
    const camId = req.params.camId;
    res.render('cam', { camId })
})

module.exports = router;