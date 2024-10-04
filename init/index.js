const mongoose = require('mongoose');
const mongooseConnect = require('../config/mongoose');
const listingData = require('./data');
const listingModel = require('../models/listing');

// mongoose.connect('mongodb://127.0.0.1:27017/WanderLust')

const init = async () => {
await listingModel.insertMany(listingData)
    
}

init()
