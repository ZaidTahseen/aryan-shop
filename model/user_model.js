
const mongoose = require('mongoose')

const Schema = mongoose.Schema


// Schema for the products 

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },
    
    role: {
        type: String,
        default: 'customer'
    },

    cart: {

        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },

                cart_price: {
                    type: Number,
                    required: true
                }
            }
        ],

        total_price: {
            type: Number,
            default: 0,
        }
    }


})


userSchema.methods.addToCartModel = async function (product, req) {

    prodId = product._id

    for (let prod of this.cart.items) {
        if (String(prod.productId) == prodId) {
            prod.quantity += 1
            prod.cart_price += product.price
            req.user.cart.total_price += product.price
            return await this.save()
        }
    }

    this.cart.items.push({
        productId: product._id,
        quantity: 1,
        cart_price: product.price,
    })

    req.user.cart.total_price += product.price
    return await this.save()

}







// Now define the model for your cluster 
module.exports = mongoose.model('User', userSchema) 