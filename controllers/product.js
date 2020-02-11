var Product = require('../models/product');
var User = require('../models/user');
var config = require('../config');
var fs = require('fs');
var path = require('path');
var faker = require('faker');
var Review = require('../models/review');
var async = require('async');

module.exports = 
{
    product : async (req, res) => {
        res.status(200).send({message: 'Product works!'})
    },

    createProduct: (req, res, next) => {
        let product = new Product();

        product.name = req.body.name;
        product.price = req.body.price;
        product.cantity = req.body.cantity;
        product.description = req.body.description;
        product.valoracion = req.body.valoracion;
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        
        if(req.body.image)
        {
            product.image = req.body.image;
        }
        else
        {
            product.image = null;

        }

        product.save();
        res.json({
            success: true,
            message: 'Successful added 10 products'});
    },

    getSellerProducts(req, res, next)
    {
        Product.find({owner: req.decoded.user._id})
            .populate('owner', 'name image email isSeller _id')
            .populate('category')
            .exec((err, productsStored) => {

            if(err)
                return next(err);

            res.json({
                success: true,
                message: 'Successful', 
                products:productsStored
            });
        });
    },

    faker(req, res, next)
    {
        for(var i=0; i<10; i++)
        {
            let product = new Product();
            product.name = faker.commerce.product();
            product.price = faker.commerce.price();
            product.cantity = faker.finance.amount();
            product.description = faker.lorem.text();
            product.image = faker.image.fashion();
            product.owner = "5df2859ae208203ebc2f2bf6";
            product.category = "5dfec481b9a91215c037b9e5";
            
            product.save();
        }

        res.json({message: 'Successful added 10 products'});
    },

    uploadImage(req, res, next)
    {
        var file_name = 'Imagen no subida...';

        if(!req.files)
        {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

            var file_path = req.files.file0.path;
            console.warn(file_path);
            var file_split = file_path.split('\\');
            console.warn(file_split);
            var file_name = file_split[2];
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            if(!isValidExtension(file_ext))
            {
                fs.unlink(file_path, (err) => {
                    return res.status(200).send({message: 'La extension no es valida'})
                });
            }
            else{
                var articleId = req.params.id;
                if(articleId)
                {
                    Product.findByIdAndUpdate(productId, {image: file_name}, {new:true}, (err, productUpdated) => {
                        if(err)
                        {
                            return res.status(500).send({message: 'Error en la peticion'});
                        }
                        else if(!productUpdated)
                        {
                            return res.status(404).send({message: 'No se ha podido actualizar'});
                        }
                        else
                        {
                            return res.status(200).send({
                                status: 'success',
                                product: productUpdated})
                        }
                    });
                }
                else
                {
                    return res.status(200).send({
                        status: 'success',
                        image: file_name
                    });
                }
            }
    },

    getImage(req, res)
    {
        var file = req.params.image;
        var path_file = './uploads/products/' + file;


        fs.exists(path_file, (exists) => {
            if(exists)
            {
                return res.sendFile(path.resolve(path_file));
            }
            else
            {
                return res.status(404).send({
                    status : 'error',
                    message: 'this image does not exists'
                });
            }
        });
    },

    getSingleProduct(req, res, next)
    {
        var productId = req.params.id;

        Product.findById({_id: productId})
            .populate('category')
            .populate('owner')
            .exec((err, product) => {
            if(err) 
            {
                return res.json({
                    success: false,
                    message: 'product doesnt exists'
                });
                
            }
            else if(product)
            {
                return res.json({
                    success: true,
                    product: product
                });
            }
        });
    },

    getAllProducts(req, res, next)
    {
        var page = 1
        if(req.params.page)
        {
            page = req.params.page;
        }
        
        var itemsPerPage = 10;
        
        Product.find({})
            .sort('name')
            .populate('category')
            .populate('owner')
            .paginate(page, itemsPerPage, (err, products, total) => {
                if(err) 
                {
                    return res.json({
                        success: false,
                        message: 'Error en la peticion'
                    });
                }
                else if(!products)
                {
                    return res.json({
                        success: false,
                        message: 'No se han encontrado productos'
                    })
                }
                else
                {
                    return res.json({
                        success: true,
                        total: total,
                        pages: Math.ceil(total / itemsPerPage),
                        products: products
                    });
                }
        });

    },

    createReview(req, res, next)
    {
        async.waterfall([
            function(callback)
            {
                Product.findOne({_id: req.body.productId}, (err, product) => {
                    if(product)
                    {
                        callback(err, product);
                    }
                });
            },

            function(product)
            {
                let review = new Review();

                if(req.body.title)
                    review.title = req.body.title;
                if(req.body.description)
                    review.description = req.body.description;

                review.rating = req.body.rating;
                review.owner = req.decoded.user._id;

                product.reviews.push(review._id);

                product.save();
                review.save();

                res.json({
                    success: true,
                    message: "Review added successfully"
                });
            }
        ])
    }
}

function isValidExtension(file_ext) {
    return file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg';
}