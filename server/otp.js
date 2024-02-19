const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const otpSchema = new mongoose.Schema({
    email: String,
    code: String,
    expiresIn: Number
}, {
    timestamp: true
});

const otp = mongoose.model('OTP', otpSchema, 'otp');
module.exports = otp;
