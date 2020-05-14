'use strict'

const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/order');

var checkJWT = require('../middleware/check-jwt');

router.get('/payment', checkJWT, OrderController.createOrder);

module.exports = router;