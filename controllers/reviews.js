const listingModel = require('../models/listing')
const reviewModel = require('../models/review')

module.exports.addReview = async (req, res) => {
    const curlisting = await listingModel.findById(req.params.id)
    const newReview = new reviewModel(req.body.review)
    newReview.author = req.user._id
    curlisting.reviews.push(newReview)  
    await curlisting.save()
    await newReview.save()
    res.redirect(`/listing/show/${curlisting._id}`)
}

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params
    console.log(id)
    await listingModel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await reviewModel.findByIdAndDelete(reviewId)
    res.redirect(`/listing/show/${id}`)
}