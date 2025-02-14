const express = require('express');

const router = express.Router();

const feedController = require('../rest-controllers/feed');

router.get('/posts', feedController.getPost);

router.post('/posts', feedController.createPost);

module.exports = router;
