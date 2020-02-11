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
    reviews: [{type: Schema.Types.ObjectId, ref:'Review'}],
    createdAt: {type: Date, default: Date.now}
}, {
    otObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ProductSchema
    .virtual('averageRating')
    .get(function(){
        var rating = 0;

        if(this.reviews.length == 0)
            rating = 0;
        else
        {
            this.reviews.map((review) => {
                rating += review.rating;
            });

            rating = rating / this.reviews.length;
        }

        return rating;
    });

module.exports = mongoose.model('Product', ProductSchema);