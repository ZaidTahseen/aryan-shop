const Product = require('../model/shop_model')
const Order = require('../model/order_model')



exports.get_all_products = async (req, res) => {

    try {
        const products = await Product.find()

        if (!req.user) {
            req.user = { cart: { items: [] } }
        }

        res.render('shop/shop.ejs', {
            title: 'E- Kart',
            all_prod: products,
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
            user_cart: req.user.cart.items
        })
    }
    catch {
        res.render('error.ejs', {
            title: 'Error',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }

}


exports.get_product_detail = async (req, res) => {
    try {

        const product_Id = req.params.id
        const item = await Product.findById(product_Id)
        res.render('shop/product_detail.ejs', {
            title: 'detail',
            product: item,
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin
        })
    }
    catch {
        res.render('error.ejs', {
            title: 'Error',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }

}




exports.add_to_cart = async (req, res) => {
    try {

        const product_Id = req.params.id
        const product = await Product.findById(product_Id)
        await req.user.addToCartModel(product, req)
        res.redirect('/cart')
    }
    catch {
        res.render('error.ejs', {
            title: 'Error',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }

}



exports.get_cart = async (req, res) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            cart_items = user.cart.items
            total_price = user.cart.total_price
            res.render('shop/cart.ejs', {
                title: 'cart',
                cart_items: cart_items,
                total_price: total_price,
                isAuthenticated: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin
            })
        })
        .catch(error => {
            res.render('error.ejs', {
                title: 'Error',
                isAuthenticated: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
            })

        })

}



exports.delete_cart_item = async (req, res) => {

    try {

        cart_item_id = req.params.id
        index = 0
        let item_cart_price = 0
        for (let item of req.user.cart.items) {
            if (item._id == cart_item_id) {
                item_cart_price = item.cart_price
                break;
            }
            index++;
        }
        req.user.cart.items.splice(index, 1)
        req.user.cart.total_price -= item_cart_price
        await req.user.save()
        res.redirect('/cart')
    }
    catch {
        res.render('error.ejs', {
            title: 'Error',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }

}



exports.delete_one_item = async (req, res) => {

    cart_item_id = req.params.id
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(async (user) => {
            for (let item of req.user.cart.items) {
                if (item._id == cart_item_id) {
                    item.quantity -= 1
                    item.cart_price -= item.productId.price
                    req.user.cart.total_price -= item.productId.price
                    break;
                }
            }
            await user.save()
            res.redirect('/cart')
        })
        .catch(
            res.render('error.ejs', {
                title: 'Error',
                isAuthenticated: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
            })
        )


}


exports.create_order = async (req, res) => {
    try {
        products = req.user.cart.items
        total_price = req.user.cart.total_price
        user_id = req.user._id
        user_name = req.user.name
        const order = new Order({
            products: products,
            total_price: total_price,
            user: { name: user_name, userId: user_id }
        })

        for (item of products) {
            const real_prod = await Product.findById(item.productId)
            real_prod.quantity -= item.quantity
            real_prod.save()
        }

        await order.save()
        req.user.cart.items = []
        req.user.cart.total_price = 0
        await req.user.save()
        res.redirect('/')
    }
    catch {
        res.render('error.ejs', {
            title: 'Error',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }

}


exports.get_orders = async (req, res) => {
    try {

        const orders = await Order.find({ 'user.userId': req.user._id }).populate('products.productId')
        res.render('shop/orders.ejs', {
            title: 'orders',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }
    catch {
        res.render('error.ejs', {
            title: 'Error',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }

}