'use strict'

const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product');

const multiparty = require('connect-multiparty');
const md_upload = multiparty({uploadDir: './uploads/products'});

var checkJWT = require('../middleware/check-jwt');

router.get('/', checkJWT, ProductController.getProducts);
router.post('/', checkJWT, [md_upload], ProductController.createProduct);

module.exports = router;