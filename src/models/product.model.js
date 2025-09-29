const mongoose = require("mongoose");

const productSchema =  new mongoose.Schema({
    id: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: false,
    },
    code: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
        default: null,
    },
    status: {
        type: Boolean,
        required: true,
    },
    stock: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnails: {
        type: String,
        default: null,    
    },
});

module.exports = mongoose.model("Product", productSchema)