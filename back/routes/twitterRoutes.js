const express = require('express');
const { postTweet } = require('../twitterController');

const router = express.Router();

router.post('/tweet', postTweet);

module.exports = router;
