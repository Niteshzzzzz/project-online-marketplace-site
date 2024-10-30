const joi = require('joi')

module.exports.listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.object({
        filename: joi.string(),
        url: joi.string()
    }),
    price: joi.number().min(0),
    location: joi.string().required(),
    country: joi.string().required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(0).max(5),
        comment: joi.string().required()
    }).required()
})