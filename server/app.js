const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
require('./conn');
//const User = require('./schema');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Using router
app.use(require('./router/auth'));

app.listen(8000, ()=>{
    console.log('Server running at port 8000');
})