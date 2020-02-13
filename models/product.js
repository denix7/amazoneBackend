'use strict'

const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');

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

    ProductSchema.plugin(mongooseAlgolia, {
        appId: 'SE9V63KLJ2',
        apiKey: '9a7675d96631b9325654edb240869dce',
        indexName: 'amazonev1',
        selector: '_id title image reviews description price owner created averageRating',
        populate: {
            path: 'owner reviews',
            select: 'name rating'
        },
        defaults: {
            author: 'uknown'
        },
        mappings: {
            title: function(value) {
                return `${value}`
            }
        },
        virtuals: {
            averageRating: function(doc) {
                var rating = 0;

                if(doc.reviews.length == 0)
                    rating = 0;
                else
                {
                    doc.reviews.map((review) => {
                        rating += review.rating;
                    });

                    rating = rating / doc.reviews.length;
                }

                return rating;
            }
        },
        debug: true 
    })

    let Model = mongoose.model('Product', ProductSchema);
    Model.SyncToAlgolia();
    Model.SetAlgoliaSettings({
        searchableAttributes: ['title']
    });
module.exports = Model; 