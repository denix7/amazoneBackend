var Category = require('../models/category');
var config = require('../config');

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
    }
}