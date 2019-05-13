const express = require('express');

const router = express.Router();

const tweets = require('../controllers/tweets');

router.get('/tweets/:id', tweets.getTweets);

router.post('/tweets', tweets.postTweets);

module.exports = router;
