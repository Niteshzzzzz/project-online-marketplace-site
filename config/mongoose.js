const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/WanderLust')

const db = mongoose.connection

db.on('err', err => {
    console.log(err);
})

db.on('open', () => {
    console.log('Connected to database.');
})