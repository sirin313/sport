// mongoose module
const mongoose= require("mongoose");
// schema et models seux methode
const matchSchema= mongoose.Schema({
    scoreOne: Number,
    scoreTwo: Number,
    teamOne: String,
    teamTwo: String,
});
const match=mongoose.model("Match",matchSchema);
// make match exportable
module.exports=match;