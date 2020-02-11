'use strict'

const mongoose = require('mongoose');

const {Schema} = mongoose;

const ReviewSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    title: { type: String},
    description: { type: String},
    rating: { type: Number, default: 0},
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Review', ReviewSchema);