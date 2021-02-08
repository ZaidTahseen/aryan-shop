const express = require('express')
const router = express.Router()

const shop_controller = require('../controller/shop_controller')

const isAuth = require('../middleware/is_auth')



router.get('/', shop_controller.get_all_products)  

router.get('/detail/:id', shop_controller.get_product_detail )  

router.get('/cart/:id', isAuth , shop_controller.add_to_cart )  

router.get('/cart', isAuth ,   shop_controller.get_cart )  

router.get('/cart/delete/:id',  isAuth ,shop_controller.delete_cart_item ) 

router.get('/cart_delete_one/:id', isAuth , shop_controller.delete_one_item )  

router.get('/create-order', isAuth , shop_controller.create_order )  

router.get('/myorder', isAuth , shop_controller.get_orders )  


module.exports = router