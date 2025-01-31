const express = require('express')
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync')
const expressError = require('../utils/expressError')
const { reviewSchema} = require('../schemaValidate.js')
const listingModel = require('../models/listing')
const reviewModel = require('../models/review.js')

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error)
    }
    next()
}

// review post route
router.post('/', validateReview, wrapAsync(async (req, res) => {
    const curlisting = await listingModel.findById(req.params.id)
    console.log(curlisting)
    const newReview = new reviewModel(req.body.review)
    curlisting.reviews.push(newReview)
    await curlisting.save()
    await newReview.save()
    res.redirect(`/listing/show/${curlisting._id}`)
}));

// delete review route
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params
    console.log(id)
    await listingModel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await reviewModel.findByIdAndDelete(reviewId)
    res.redirect(`/listing/show/${id}`)
}))

module.exports = router;