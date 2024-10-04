const express = require('express')
const app = express();
const mongooseConnnection = require('./config/mongoose')
const listingModel = require('./models/listing')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const wrapAsync = require('./utils/wrapAsync')
const expressError = require('./utils/expressError')
const {listingSchema} = require('./schemaValidate.js')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public/css')))
app.use(express.static(path.join(__dirname, 'public/js')))

const validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error)
    }
    next()
}

app.get('/', (req, res) => {
    res.send('working...')
})

// app.get('/test', async (req, res) => {
//     let createdListing = await listingModel.create({
//         title: "Apna Villa",
//         description: "Apna Villa is available to book room on rent.",
//         price: 2000,
//         location: "kookas Jaipur, Rajasthan",
//         country: "India"
//     })
//     console.log('listing created successfully');
//     res.send(createdListing)
// })

// index route
app.get('/listing', wrapAsync(async (req, res) => {
    let allListing = await listingModel.find()
    res.render('listing/index.ejs', { allListing })
}))

//show route
app.get('/listing/show/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let showListing = await listingModel.findOne({ _id: id })
    res.render('listing/show.ejs', { showListing })
}))

// new route
app.get('/listing/new', (req, res) => {
    res.render('listing/new.ejs')
})

// create route
app.post('/listing/create', validateListing, wrapAsync(async (req, res) => {
    let { title, description, url, price, location, country } = req.body;
    let createdListing = await listingModel.create({
        title: title,
        description: description,
        image: { url: url },
        price,
        location,
        country
    })
    res.redirect('/listing')
}))

// edit route
app.get('/listing/edit/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listingModel.findOne({ _id: id })
    res.render('listing/edit.ejs', { editListing })
}))

// update route
app.put('/listing/update/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, url, price, location, country } = req.body;
    let reqListing = await listingModel.findOneAndUpdate({ _id: id }, { title, description, image: { url }, price, location, country }, { new: true })
    res.redirect(`/listing/show/${id}`)
}))

// listing delete route
app.delete('/listing/delete/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listingModel.findOneAndDelete({ _id: id })
    res.redirect('/listing')
}))

app.all('*', (req, res, next) => {
    next(new expressError(404, 'Page Not Found.'))
})

app.use((err, req, res, next) => {
    const { status = 500, message = "something went wrong!" } = err;
    // res.status(status).send(message);
    res.render('error.ejs', { message, status })
})

app.listen(3000, () => {
    console.log('Connected to server.');

})