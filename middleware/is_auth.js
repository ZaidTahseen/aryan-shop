module.exports = (req , res , next ) => {
    
    if(!req.session.isLoggedIn){
        return res.redirect('/login')
    }

    if (req.user.role == 'admin' && req.url == '/cart'){
        return res.redirect('/')
    }

    next()
}