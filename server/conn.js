const mongoose = require('mongoose');
require("dotenv").config();
//Database connection
const DB = process.env.DB;

mongoose.connect(DB).then(() => {
    console.log('connected');
}).catch((err) => console.log(err));