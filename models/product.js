const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema= new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: [ 
        {
            url: String,
            filename: String
        }
    ],
    category: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    default: []
})
const Product = mongoose.model('Product', productSchema);
module.exports = Product;