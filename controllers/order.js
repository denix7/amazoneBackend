var Order = require('../models/order');
var Product = require('../models/product');

module.exports = 
{
    createOrder: (req, res) =>{
        const stripeToken = req.body.stripeToken;
        const currentCharges = Math.round(req.body.totalPrice * 100);

        stripe.customers
            .create({
                source: stripeToken.id
            })
            .then(function(customer){
                return stripe.charges.create({
                    amount: currentCharges,
                    currency: 'usd',
                    customer: customer.id
                });
            })
            .then(function(charge){
                const products = req.body.products;

                let order = new Order();
                order.owner = req.decode.user._id;
                order.totalPrice = currentCharges;

                products.map(product => {
                    order.products.push({
                        product: product.product,
                        quantity: product.quantity
                    });
                });

                order.save();
                res.json({
                    success: true,
                    message: 'Successfully made a payment'});
            });
    }
}