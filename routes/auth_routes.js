const express = require('express')
const router = express.Router()

const auth_controller  = require('../controller/auth_controller')

const isAuth = require('../middleware/is_auth')


router.get('/signup' ,  auth_controller.get_signup )   

router.post('/register_user' ,  auth_controller.register_user)   

router.get('/login' ,  auth_controller.get_login )  

router.post('/post_login' ,  auth_controller.post_login )  

router.get('/logout' , isAuth ,   auth_controller.logout )  

module.exports = router