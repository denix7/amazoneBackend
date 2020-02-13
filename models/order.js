const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    totalPrice: {type: Number, default: 0},
    products: [{
        product: {type: Schema.Types.ObjectId, ref: 'Products'},
        quantity: {type: Number, default: 1}
    }],
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Order', OrderSchema);