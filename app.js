const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./model/user_model')
const multer = require('multer')
const app = express()
require('./prod')(app)
MONGODB_URL = 'mongodb+srv://campk12:campk123@shop.viksn.mongodb.net/<dbname>?retryWrites=true&w=majority'


// store every session in database 
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
})

// parse application/json
app.use(bodyParser.json())

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}




// Set template Engine Ejs 
app.set('view engine', 'ejs');
app.set('views', 'views');



// Importing shop_routes 
const adminRoutes = require('./routes/admin_routes')
const shopRoutes = require('./routes/shop_route')
const authRoutes = require('./routes/auth_routes')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(multer({ dest :'images'}).single('image'));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// using express session 
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}))

app.use(async (req, res, next) => {

    try {

        if (!req.session.user) {
            return next()
        }
        const user = await User.findById(req.session.user._id)
        req.user = user
        next()
    }
    catch {
        res.render('error.ejs', {
            title: 'Error',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        })
    }

})


// Using shop_routes 
app.use(shopRoutes)
app.use(adminRoutes)
app.use(authRoutes)

const port = process.env.PORT || 3000

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then((result) => {
 
        app.listen( port , async () => {
            console.log('DB Connected !!!!!!!!!!!! ')
            console.log('Listening on Port  3000 ')
        })
    })

    .catch((err) => {
        console.log(err)
    })