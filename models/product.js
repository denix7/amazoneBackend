'use strict'

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {type: String, required:true},
    price: {type: Number, required: true},
    cantity: {type: Number, default:1},
    description: {type: String, required: true},
    valoracion: {type: String},
    image: String,
    owner: {type: Schema.Types.ObjectId, ref:'User'},
    category: {type: Schema.Types.ObjectId, ref:'Category'},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', ProductSchema);