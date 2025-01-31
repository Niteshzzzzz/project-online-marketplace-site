const app = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = app.Router()
const User = require('../models/user.js');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('user/signup.ejs')
})

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const {username, email, password} = req.body
        let newUser = new User({username, email})
        await User.register(newUser, password)
        req.flash('success', 'You SignUp successfully')
        res.redirect('/listing')
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/signup')
    }
}))

router.get('/login', (req, res) => {
    res.render('user/login.ejs')
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login' , failureFlash: true}) , (req, res) => {
    req.flash('success', 'LogIn successfully!')
    res.redirect('/listing')
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
    })
    req.flash('success', 'Logged Out!')
    res.redirect('/listing')
})

module.exports = router;