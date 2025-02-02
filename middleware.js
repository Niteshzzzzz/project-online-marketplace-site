const listingModel = require('./models/listing')
const reviewModel = require('./models/review.js');
const { listingSchema, reviewSchema } = require('./schemaValidate')
const expressError = require('./utils/expressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    } else {
        res.locals.redirectUrl = '/listing'
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listeng = await listingModel.findById(id)
    if (!listeng.owner.equals(res.locals.currUser._id)) {
        req.flash('error', 'You have no permission!')
        return res.redirect(`/listing/show/${id}`)
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;
    let review = await reviewModel.findById(reviewId)
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash('error', 'You have no permission, not your comment!')
        return res.redirect(`/listing/show/${id}`)
    }
    next()
}