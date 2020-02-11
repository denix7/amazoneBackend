'use strict'

const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product');

const multiparty = require('connect-multiparty');
const md_upload = multiparty({uploadDir: './uploads/products'});

var checkJWT = require('../middleware/check-jwt');

router.get('/', checkJWT, ProductController.getSellerProducts);
router.post('/', checkJWT, ProductController.createProduct);
router.post('/', checkJWT, ProductController.createProduct);
router.get('/faker/test', ProductController.faker);
router.post('/upload-image/:id?', [md_upload], ProductController.uploadImage);
router.get('/get-image/:image', ProductController.getImage);

router.get('/product/:id', ProductController.getSingleProduct);
router.get('/products/:page?', ProductController.getAllProducts);

router.post('/products/review', checkJWT, ProductController.createReview);

module.exports = router;