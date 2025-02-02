const User = require('../models/user')

module.exports.renderSignupForm = (req, res) => {
    res.render('user/signup.ejs')
}

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        let newUser = new User({ username, email })
        let registerUser = await User.register(newUser, password)
        req.login(registerUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to BookMyStay!')
            res.redirect('/listing')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/signup')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('user/login.ejs')
}

module.exports.login = (req, res) => {
    try {
        req.flash('success', 'LogIn successfully!')
        res.redirect(res.locals.redirectUrl)
    } catch (error) {
        req.flash('success', 'LogIn successfully!')
        res.redirect('/listing')
    }
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
    })
    req.flash('success', 'Logged Out!')
    res.redirect('/listing')
}