const express = require('express');
const router = express.Router();
const { createNewUser } = require('../controllers/user');

router.post('/new-user', createNewUser);

module.exports = router;