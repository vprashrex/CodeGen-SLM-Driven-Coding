const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    }
});

//Password hashing
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
}); 

//JWT Token Generation
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({email:this.email},"MySECRETKeyfordatabasejwt123");
        return token;
    }
    catch(err){
        console.log(err);
    }

}
const User = mongoose.model('USER', userSchema);

module.exports = User;