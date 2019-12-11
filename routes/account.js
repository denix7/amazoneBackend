const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserController = require('../controllers/account');

router.get('/signup', UserController.home);
router.post('/signup', UserController.saveUser);

module.exports = router;