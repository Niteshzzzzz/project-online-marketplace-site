const listingModel = require('../models/listing')

module.exports.index = async (req, res) => {
    let allListing = await listingModel.find()
    res.render('listing/index.ejs', { allListing })
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let showListing = await listingModel.findOne({ _id: id }).populate({path:'reviews', populate:{path: 'author',},}).populate('owner')
    if(!showListing){
        req.flash('error', 'Listing Does Not Exist!')
        res.redirect('/listing')
    }
    res.render('listing/show.ejs', { showListing })
}

module.exports.renderListingForm = (req, res) => {
    res.render('listing/new.ejs')
}

module.exports.createListing = async (req, res) => {
    let { title, description, url, price, location, country } = req.body;
    console.log(url)
    let createdListing = await listingModel.create({
        title: title,
        description: description,
        image: { url: url },
        price,
        location,
        country,
        owner: req.user._id,
    })
    req.flash('success', 'Listing Created Successfully!')
    res.redirect('/listing')
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let editListing = await listingModel.findOne({ _id: id })
    if(!editListing){
        req.flash('error', 'Listing Does Not Exist!')
        res.redirect('/listing')
    }
    res.render('listing/edit.ejs', { editListing })
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, url, price, location, country } = req.body;
    await listingModel.findOneAndUpdate({ _id: id }, { title, description, image: { url }, price, location, country }, { new: true })
    req.flash('success', 'Listing Edited Successfully!')
    res.redirect(`/listing/show/${id}`)
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await listingModel.findOneAndDelete({ _id: id })
    req.flash('success', 'Listing Deleted!')
    res.redirect('/listing')
}