const { text } = require('body-parser')
const mongoose = require('mongoose')

const Schema = mongoose.Schema


// Schema for the products 

const productSchema = new Schema( {

    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true
    },
    quantity : {
        type : Number,
        required :true
    } , 
    detail: {
        type : [ String ],
        required : true
    }

})




// Now define the model for your cluster 
module.exports =  mongoose.model('Product' , productSchema ) 