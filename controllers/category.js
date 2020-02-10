var Category = require('../models/category');
var Product = require('../models/product');
var config = require('../config');
var mongoosePagination = require('mongoose-pagination');
var async = require('async');

module.exports = 
{
    category: (req, res) =>{
        res.status(200).send({message: 'Category its works!'});
    },

    createCategory: (req, res) => {
        let category = new Category();

        category.name = req.body.name.toLowerCase();

        Category.findOne({name: req.body.name.toLowerCase()}, (error, categoryStored) => {
            if(categoryStored)
            {
                res.json({
                    success : false,
                    message: 'This category exists'
                });
            }
            else
            {
                category.save();
                res.json({
                    success: true,
                    messgae: 'Category saved'
                });
            }                
        });
    },

    getCategories: (req, res) => {
        Category.find({}, (err, categories) => {
            if(err)
            {
                res.json({
                    success: false,
                    message: 'Error en la peticion'
                });
            }
            else
            {
                res.json({
                    success: true,
                    message: 'Successful',
                    categories: categories
                })
            }
        })
    },

    editCategory: (req, res) => {

        categoryUpdated = req.body;
        categoryId = req.params.id;

        Category.findByIdAndUpdate(categoryId, categoryUpdated, {new:true}, (error, categoryUpdated) => {
            if(categoryUpdated)
            {
                // category.save();
                res.json({
                    success: true,
                    message: 'Category saved',
                    category: categoryUpdated
                });
            }
            else
            {
                res.json({
                    success : false,
                    message: 'This category does not exist'
                });
            }                
        });
    },

    deleteCategory: (req ,res) =>
    {
        categoryId = req.params.id;

        Category.findByIdAndDelete(categoryId, (error, categoryDeleted) => {
            if(error)
            {
                res.json({
                    success: 'false',
                    message: 'Error en la peticion'
                });
            }else
            {
                res.json({
                    success: 'true',
                    message: 'Category deleted'
                });
            }
        })
    },

    getSpecificCategory: (req, res, next) =>
    {
        var perPage = 10;
        var page = req.querty.page;
        
        async.waterfall([
            function(callback)
            {
                Product.countDocuments({category: req.params.id}, (err, countDocuments) => {
                    var totalProducts = countDocuments;
                    callback(err, totalProducts)
                });
            },

            function(totalProducts, callback)
            {
                Product.find({category: req.params.id})
                    .skip((perPage * page)-page)
                    .limit(perPage)
                    .populate('category')
                    .populate('owner')
                    .exec((err, products) => {

                        if(err) return next(err);
                        callback(err, products, totalProducts)
                    });
            },

            function(products, totalProducts, callback)
            {
                Category.findOne({_id: req.params.id}, {"_id":0, "createdAt":0, "__v":0}, (err, category) => {

                    res.json({
                        success: true,
                        message: 'category',
                        products: products,
                        totalProducts: totalProducts,
                        categoryName: category,
                        pages: Math.ceil(totalProducts / perPage)
                    });
                });
            },
        ]);
    },

    getSpecificCategoryParallel: (req, res, next) =>
    {
        var perPage = 10;
        var page = req.query.page;
        
        async.parallel([
            function(callback)
            {
                Product.countDocuments({category: req.params.id}, (err, countDocuments) => {
                    var totalProducts = countDocuments;
                    callback(err, totalProducts)
                });
            },

            function(callback)
            {
                Product.find({category: req.params.id})
                    .skip((perPage * page)-page)
                    .limit(perPage)
                    .populate('category')
                    .populate('owner')
                    .exec((err, products) => {

                        if(err) return next(err);
                        callback(err, products);
                    });
            },

            function(callback)
            {
                Category.findOne({_id: req.params.id}, {"_id":0, "createdAt":0, "__v":0}, (err, category) => {
                    if(err) return next(err);
                    callback(err, category);
                });
            }

        ], function(err, results)
        {
            var totalProducts = results[0];
            var products = results[1];
            var category = results[2];

            res.json({
                success: true,
                message: 'category',
                products: products,
                totalProducts: totalProducts,
                categoryName: category,
                pages: Math.ceil(totalProducts / perPage)
            });
        });
    }
}