const express = require('express');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

const { isLoggedIn } = require('./middleware');
const session = require('express-session');
const methodOverride = require('method-override'); 
const catchAsync = require('./utils/catchAsync');

const User = require('./models/user');
const Product = require('./models/product');
const Review = require('./models/review');

const secret = 'thisshouldbeabettersecret!';
const dbUrl = 'mongodb://127.0.0.1:27017/ecommerce';
mongoose.connect(dbUrl, {
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})


const sessionConfig = {
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Register and Login 
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const user = new User({ username, email, phone });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/products');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const redirectUrl = req.session.returnTo || '/products';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//logout
app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
});