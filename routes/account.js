const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var checkJWT = require('../middleware/check-jwt');

const User = require('../models/user');
const UserController = require('../controllers/account');

router.get('/signup', UserController.home);
router.post('/signup', UserController.saveUser);
router.post('/login', UserController.loginUser);

router.route('/profile')
    .get(checkJWT, UserController.getProfile)
    .post(checkJWT, UserController.updateProfile);

router.route('/address')
    .get(checkJWT, UserController.getAddress)
    .post(checkJWT, UserController.updateAddress);
    
module.exports = router;