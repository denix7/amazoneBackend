const express = require('express');
const router = express.Router();
var checkJWT = require('../middleware/check-jwt');

const CategoryController = require('../controllers/category');

router.get('/', CategoryController.category);

router.route('/categories')
    .get(checkJWT, CategoryController.getCategories)
    .post(checkJWT, CategoryController.createCategory);

router.route('/categories/:id')
    .put(checkJWT, CategoryController.editCategory)
    .delete(checkJWT, CategoryController.deleteCategory);
    
router.route('/categories/:id/:page?')
    .get(CategoryController.getSpecificCategoryParallel);
module.exports = router;