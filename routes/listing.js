const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')
const {listingSchema} = require('../schemaValidate.js')
const listingModel = require('../models/listing')

const validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error)
    }
    next()
}

// index route
router.get('/', wrapAsync(async (req, res) => {
    let allListing = await listingModel.find()
    res.render('listing/index.ejs', { allListing })
}))

//show route
router.get('/show/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let showListing = await listingModel.findOne({ _id: id }).populate('reviews')
    if(!showListing){
        req.flash('error', 'Listing Does Not Exist!')
        res.redirect('/listing')
    }
    res.render('listing/show.ejs', { showListing })
}))

// new route
router.get('/new', (req, res) => {
    res.render('listing/new.ejs')
})

// create route
router.post('/create', validateListing, wrapAsync(async (req, res) => {
    let { title, description, url, price, location, country } = req.body;
    console.log(url)
    let createdListing = await listingModel.create({
        title: title,
        description: description,
        image: { url: url },
        price,
        location,
        country
    })
    req.flash('success', 'Listing Created Successfully!')
    res.redirect('/listing')
}))

// edit route
router.get('/edit/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listingModel.findOne({ _id: id })
    if(!editListing){
        req.flash('error', 'Listing Does Not Exist!')
        res.redirect('/listing')
    }
    res.render('listing/edit.ejs', { editListing })
}))

// update route
router.put('/update/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, url, price, location, country } = req.body;
    let reqListing = await listingModel.findOneAndUpdate({ _id: id }, { title, description, image: { url }, price, location, country }, { new: true })
    req.flash('success', 'Listing Edited Successfully!')
    res.redirect(`/listing/show/${id}`)
}))

// listing delete route
router.delete('/delete/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listingModel.findOneAndDelete({ _id: id })
    req.flash('success', 'Listing Deleted!')
    res.redirect('/listing')
}))

module.exports = router;