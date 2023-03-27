const mongoose =require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const userSchema= mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String , unique: true},
    password: String,
    role:String,
    avatar:String
});

const user =mongoose.model("User", userSchema)
userSchema.plugin(uniqueValidator);
module.exports=user;