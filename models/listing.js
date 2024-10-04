const mongoose = require('mongoose')

let listingSchema = mongoose.Schema({
    title: {
        type: String,
        minLength: 3,
        required: true
    },
    description: {
        type: String,
        minLength: 3,
        required: true
    },
    image: {
        filename: {
            type: String,
            default: 'listingimage'
        },
        url: {
            type: String,
            default: "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
            set: (v) => v === "" ? "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg" : v
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('listing', listingSchema)