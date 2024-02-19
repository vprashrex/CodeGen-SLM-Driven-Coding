const mongoose = require('mongoose');

//Database connection
const DB = 'mongodb://127.0.0.1:27017/'

mongoose.connect(DB).then(() => {
    console.log('connected');
}).catch((err) => console.log(err));