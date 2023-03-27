const mongoose=require("mongoose");


const teamSchema=mongoose.Schema({
name:String,
owner:String,
foundation:String,
stadium:String,

});

const team=mongoose.model("Team",teamSchema);

module.exports=team;