const User = require('../model/user_model')

const bcrypt = require('bcryptjs')


exports.get_signup = async (req, res) => {
    try {

        res.render('admin/signup', {
            title: 'signup',
            message: '',
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


exports.register_user = async (req, res) => {
    try {

        const email = req.body.email
        const name = req.body.name
        let user = await User.findOne({ email: email })

        if (user) {
            return res.render('admin/signup', {
                title: 'signup',
                message: '*** User already registered ',
                isAuthenticated: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin
            })
        }

        let password = req.body.password
        let salt = bcrypt.genSaltSync(10);
        let hashed_password = bcrypt.hashSync(password, salt);

        user = new User({
            name: name,
            email: email,
            password: hashed_password
        })

        await user.save()
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


exports.get_login = async (req, res) => {
    try {

        res.render('admin/login.ejs', {
            title: 'login',
            message: '',
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

exports.post_login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.render('admin/login.ejs', { title: 'login', message: 'Email/Password is Invalid', isAuthenticated: req.session.isLoggedIn })
        }
        let matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.render('admin/login.ejs', { title: 'login', message: 'Email/Password is Invalid', isAuthenticated: req.session.isLoggedIn })
        }
        if (user.role == 'admin') {
            req.session.isAdmin = true
        }
        req.session.isLoggedIn = true
        req.session.user = user
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


exports.logout = async (req, res) => {
    try {

        await req.session.destroy()
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