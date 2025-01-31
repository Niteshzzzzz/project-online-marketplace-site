const express = require('express')
const app = express();
const mongooseConnnection = require('./config/mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const expressError = require('./utils/expressError')
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public/css')))
app.use(express.static(path.join(__dirname, 'public/js')))

const sessionOption = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/', (req, res) => {
    res.send('working...')
})

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/demouser', async (req, res) => {
    const fakeUser = new User({
        email: 'nitesh@gmail.com',
        username: 'niteshzzzzz'
    })
    const registeredUser = await User.register(fakeUser, 'Nitesh123@');
    res.send(registeredUser)
})

app.use('/listing', listingRouter)
app.use('/listing/:id/review', reviewRouter)
app.use('/', userRouter)

app.all('*', (req, res, next) => {
    next(new expressError(404, 'Page Not Found.'))
})

app.use((err, req, res, next) => {
    const { status = 500, message = "something went wrong!" } = err;
    res.status(status).send(message);
    res.render('error.ejs', { message, status })
})

app.listen(3000, () => {
    console.log('Connected to server.');

})