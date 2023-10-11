const express = require("express")
const nocache = require('nocache');
const user_route = express()
const session = require("express-session")
const config = require("../config/config")

//session
user_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

const auth = require("../middleware/auth")

user_route.use(nocache());

// view engine setup
user_route.set('view engine', 'ejs')
user_route.set('views','./views/users')

//body parser

const bodyParser = require('body-parser')
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded ({extended: true}))


// handling user requests through userController module

const userController = require("../controllers/userController");

user_route.get('/register', auth.isLogout, userController.loadRegister);
user_route.post('/register', userController.insertUser);
user_route.get('/', auth.isLogout, userController.loginLoad)
user_route.get('/login', auth.isLogout, userController.loginLoad)
user_route.post('/login', userController.verifyLogin);
user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/logout', auth.isLogin, userController.userLogout);

module.exports = user_route;