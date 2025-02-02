const express = require('express')
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync')
const listingModel = require('../models/listing')
const reviewModel = require('../models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js')

// review post route
router.post('/', validateReview, isLoggedIn , wrapAsync(reviewController.addReview));

// delete review route
router.delete('/:reviewId',isLoggedIn ,isReviewAuthor , wrapAsync(reviewController.destroyReview))

module.exports = router;