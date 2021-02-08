const { render } = require('ejs')
const express = require('express')
const router = express.Router()

const admin_controller  = require('../controller/admin_controller')

const isAuth = require('../middleware/is_auth')

router.get('/admin' , isAuth  , admin_controller.get_admin_products )

router.get('/create-product' , isAuth , admin_controller.create_product )

router.post('/create-product' , isAuth , admin_controller.post_create_product  )   

router.get('/delete/:prod_id' ,  isAuth , admin_controller.delete_products  )   

router.get('/edit/:prod_id' , isAuth  ,  admin_controller.edit_product  )   

router.get('/all_orders' , isAuth  ,  admin_controller.get_all_orders  )   

module.exports = router