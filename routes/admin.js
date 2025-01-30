const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin')
})
router.get('/backend', (req, res) => {
    res.render('admin/backend')
})

module.exports = router;