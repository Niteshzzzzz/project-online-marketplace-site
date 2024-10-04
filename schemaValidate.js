const joi = require('joi')

module.exports.listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.object({
        filename: joi.string(),
        url: joi.string().allow("", null)
    }),
    price: joi.number().min(0),
    location: joi.string().required(),
    country: joi.string().required()
})