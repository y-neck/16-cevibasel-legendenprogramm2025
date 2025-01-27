const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('admin login page')
})
router.get('/backend', (req, res) => {
    res.send('Admin page')
})

module.exports = router;