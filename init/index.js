const mongoose = require('mongoose');
const mongooseConnect = require('../config/mongoose');
let listingData = require('./data');
const listingModel = require('../models/listing');

// mongoose.connect('mongodb://127.0.0.1:27017/WanderLust')

const init = async () => {

listingData = listingData.map(obj => ({...obj, owner: '679ca598e140fe11fa628faf'}))
await listingModel.insertMany(listingData)    
}

init()
