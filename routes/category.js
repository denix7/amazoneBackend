const express = require('express');
const router = express.Router();
var checkJWT = require('../middleware/check-jwt');

const CategoryController = require('../controllers/category');

router.get('/', CategoryController.category);

router.route('/categories')
    .get(checkJWT, CategoryController.getCategories)
    .post(checkJWT, CategoryController.createCategory);

module.exports = router;