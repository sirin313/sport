// mongoose module
const mongoose= require("mongoose");
// schema et models sont deux methode
const playerSchema= mongoose.Schema({
    name: String,
    age: Number,
    position: String,
    number: Number,
});
const player=mongoose.model("Player",playerSchema);
// make match exportable
module.exports=player;