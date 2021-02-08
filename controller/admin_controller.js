const Product = require('../model/shop_model')
const User = require('../model/user_model')
const Order = require('../model/order_model')

exports.get_admin_products = async (req, res) => {
    try {

        const prod = await Product.find()
        res.render('admin/shop_admin.ejs', {
            title: 'Add-Product',
            all_prod: prod,
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


exports.create_product = (req, res) => {
    try {

        res.render('admin/create_product.ejs', {
            title: 'Add-Product',
            product: {},
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

exports.post_create_product = async (req, res) => {
    try {

        if (req.file) {
            const image = req.file
            var imageUrl = image.path
        }

        if (req.body.prod_id.length == 0) {

            const product = new Product({
                title: req.body.title,
                price: req.body.price,
                imageUrl: imageUrl,
                about: req.body.about,
                quantity: req.body.quantity,
                detail: [
                    req.body.detail_1,
                    req.body.detail_2,
                    req.body.detail_3
                ]
            })
            // It take few seconds 
            await product.save()
            res.redirect('/')
        }

        else {
            let product = await Product.findById(req.body.prod_id)
            product.title = req.body.title
            product.price = req.body.price
            product.imageUrl = product.imageUrl
            product.about = req.body.about,
                product.quantity = req.body.quantity,
                product.detail = [
                    req.body.detail_1,
                    req.body.detail_2,
                    req.body.detail_3
                ]
            await product.save()
            res.redirect('/')

        }
    }
    catch {
        res.render('error.ejs', {
            title: 'Error',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }


}

exports.delete_products = async (req, res) => {
    try {

        await Product.findByIdAndRemove({ _id: req.params.prod_id })
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


exports.edit_product = async (req, res) => {
    try {

        const prod_id = req.params.prod_id
        const product = await Product.findById(prod_id)
        res.render('admin/create_product', {
            title: 'Edit-Product',
            product: product,
            edit: true,
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


exports.get_all_orders = async (req, res) => {
    try {

        const orders = await Order.find()
        res.render('admin/admin_order.ejs', {
            title: 'Admin_Orders',
            orders: orders,
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