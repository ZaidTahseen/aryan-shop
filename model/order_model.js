const { text } = require('body-parser')
const mongoose = require('mongoose')

const Schema = mongoose.Schema


// Schema for the products 

const orderSchema = new Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId , required: true , ref :'Product' },
            quantity: { type: Number, required: true },
            cart_price : { type: Number, required: true }
        }
    ],
    user: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    } ,
    total_price : {type: Number, required: true} 
})




// Now define the model for your cluster 
module.exports = mongoose.model('Order', orderSchema) 