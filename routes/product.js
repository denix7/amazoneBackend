'use strict'

const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product');

const multiparty = require('connect-multiparty');
const md_upload = multiparty({uploadDir: './uploads/products'});

var checkJWT = require('../middleware/check-jwt');

router.get('/', checkJWT, ProductController.getProducts);
router.post('/', checkJWT, ProductController.createProduct);
router.post('/', checkJWT, ProductController.createProduct);
router.get('/faker/test', ProductController.faker);
router.post('/upload-image/:id?', [md_upload], ProductController.uploadImage);
router.get('/get-image/:image', ProductController.getImage);

router.get('/:id', checkJWT, ProductController.getSingleProduct);

module.exports = router;