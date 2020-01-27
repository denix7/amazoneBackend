var Product = require('../models/product');
var User = require('../models/user');
var config = require('../config');
var fs = require('fs');
var faker = require('faker');

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
        product.image = null;
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;

        if(req.files)
        {
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];
    
            if(isValidExtension(file_ext))
            {
                product.image = file_name;
                product.save();
                res.json({
                    success: true,
                    message: 'Successfully Added the product'
                });  
            }
            else
            {
                fs.unlink(file_path, (err) => {
                    return res.status(200).send({message: "La extension no es valida"});
                }); 
            }
        }
        else
        {
            return res.status(200).send({message: 'No se han subido imagenes'});
        }
    },

    getProducts(req, res, next)
    {
        Product.find({owner: req.decoded.user._id})
            .populate('owner', 'name image email isSeller _id')
            .populate('category')
            .exec((err, productsStored) => {

            if(err)
                return next(err);

            res.json({success: true, message: 'Successful', products:productsStored});
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
    }
}

function isValidExtension(file_ext) {
    return file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg';
}