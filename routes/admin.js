const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('admin page')
})
router.get('/login', (req, res) => {
    res.send('Admin login')
})

module.exports = router;