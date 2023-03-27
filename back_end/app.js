// import express module
const express = require("express");
// import bcrypt module
const bcrypt = require("bcrypt")
// import multer module
const multer = require("multer")
// import path module
const path = require("path")
// import body-parser module
const bodyParser = require("body-parser");
// import axios
const axios = require("axios");
// import jsonwebtoken
const jwt = require("jsonwebtoken")
// Import authenticate 
const authenticate= require("./middelware/authentificate")
// Creates an Express application
const app = express();
// configure body-parser 
// send JSON response
app.use(bodyParser.json());
// import Mongoose module
const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/sportdb');
// get objects from request
app.use(bodyParser.urlencoded({ extended: true }));

// avatars=> shortcut
// backend/images =>original path
app.use('/avatars', express.static(path.join('back_end/images')))
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storageConfig = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Mime type is invalid");
        if (isValid) {
            error = null;
        }
        cb(null, 'back_end/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + '-' + Date.now() + '-crococoder-' + '.' + extension;
        cb(null, imgName);
    }
});

// Security configuration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Content-Type, X-Requested-with, Authorization, expiresIn"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS, PATCH, PUT"
    );
    next();
});

// import match model
const Match = require("./models/match")
const Player = require("./models/player")
const User = require("./models/user")
const Team = require("./models/team")
// ***********************************************************
let matchesTab = [{ id: 1, scoreOne: 2, scoreTwo: 0, teamOne: "ca", teamTwo: "est" }
];

// business logic : add match
app.post("/matches", (req, res) => {
    console.log("Here BL : Add Match");
    let match = new Match({
        scoreOne: req.body.scoreOne,
        scoreTwo: req.body.scoreTwo,
        teamOne: req.body.teamOne,
        teamTwo: req.body.teamTwo
    });
    console.log("here match", match);
    match.save();
    res.json({ message: "added" });
});

// business logic : get all matches
app.get("/matches",authenticate, (req, res) => {
    console.log("Here BL : Get All Matches");
    Match.find().then((data) => {
        res.json({ matches: data, message: "ok" })
    })

});

// business logic : Edit Match
app.put("/matches", (req, res) => {
    console.log("Here BL : Edit Match", req.body);
    let newMatch = req.body;
    Match.updateOne({ _id: newMatch._id }, newMatch).then(
        (editResponse) => {
            if (editResponse.nModified == 1) {
                res.json({ message: "Match edited with success" })
            }
        }
    )

});

// business logic :get Match by id
app.get("/matches/:id", (req, res) => {
    console.log("Here BL : get Match by id");
    let id = req.params.id;
    Match.findOne({ _id: id }).then((data) => {
        res.json({ findedMatch: data })
    })
});

// business logic :delete Match 
app.delete("/matches/:id", (req, res) => {
    console.log("Here BL : delete Match by id");
    let id = req.params.id;
    for (let i = 0; i < matchesTab.length; i++) {
        if (matchesTab[i].id == id) {
            matchesTab.splice(i, 1);
            break;
        }
    }
    res.json({ message: ` Match N° ${id} is deleted` })
});
// *********************************************************************
// business logic : add player
app.post("/players", (req, res) => {
    console.log("Here BL : Add Player");
    let player = new Player({
        name: req.body.name,
        age: req.body.age,
        position: req.body.position,
        number: req.body.number
    });
    console.log("here player", player);
    player.save();
    res.json({ message: "added" });
});



// business logic : Edit player
app.put("/players", (req, res) => {
    console.log("Here BL : Edit player");

});

// business logic :delete Player
app.delete("/players/:id", (req, res) => {
    console.log("Here BL : delete player");

});
// business logic :get player by id
app.get("/players/:id", (req, res) => {

    let id = req.params.id;
    Player.findOne({ _id: id }).then((data) => {
        res.json({ player: data })
    })

});

// business logic : get all players

app.get("/players", (req, res) => {

    Player.find().then((data) => {
        res.json({ players: data, message: "ok" })
    })

});


// ********************************************************
// business logic : login
// 0 check email
// 1 check password
// 2 Welcome
app.post("/allUsers/signin", (req, res) => {
    console.log("Here BL : login", req.body);
    let user = req.body;
    let findedUser;
    User.findOne({ email: user.email }).then(
        (doc) => {
            findedUser = doc;
            console.log("here searched object By email", doc);
            if (!doc) {
                res.json({ message: "0" })
            }
            return bcrypt.compare(user.password, doc.password)
        })
        .then((pwdResult) => {
            console.log("here pwdResult", pwdResult);
            if (!pwdResult) {
                res.json({ message: "1" })
            } else {
                const  token = jwt.sign(
                    {
                      email: findedUser.email,
                      userId: findedUser._id,
                      userRole: findedUser.role,
                    },
                     "Testing" ,
                    { expiresIn:  "1min"  }
                  );
                   let userToSend = {
                    id: findedUser._id,
                    firstName: findedUser.firstName,
                    lastName: findedUser.lastName,
                    role: findedUser.role,
                    jwt: token,
                    expiresIn:  60,
                  };
 
                res.json({ message: "2",user:userToSend })
            }
        })

});
// business logic : signup
app.post("/allUsers/subscription", multer({ storage: storageConfig }).single('img'), (req, res) => {
    console.log("Here BL : signup", req.body);
    bcrypt.hash(req.body.password, 8).then(
        (cryptedPwd) => {
            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: cryptedPwd,
                role: req.body.role,
                avatar: `http://localhost:3000/avatars/${req.file.filename}`
            });
            user.save((err, doc) => {
                console.log("here error", err);
                console.log("here doc", doc);
                if (doc) {
                    res.json({ message: "User added " })
                } else {
                    res.json({ message: "Error" })
                }
            });

        }
    )

});

// business logic : Edit Profile
app.put("/allUsers", (req, res) => {
    console.log("Here BL : Edit profile");

});
// ******************************************************************************************
app.post("/matches/search", (req, res) => {
    console.log("Here BL : search", req.body);
    let searchMatch = [];
    for (let i = 0; i < matchesTab.length; i++) {
        if (matchesTab[i].scoreOne == req.body.scoreOne &&
            matchesTab[i].scoreTwo == req.body.scoreTwo) {
            searchMatch.push(matchesTab[i]);
        }

    }
    res.json({ matches: searchMatch })

})

// bussness logic add team
app.post("/teams", (req, res) => {
    console.log("here into bussness logic add team", req.body);
    let teamObject = new Team({
        name: req.body.name,
        foundation: req.body.foundation,
        stadium: req.body.stadium,
        owner: req.body.owner


    })
    teamObject.save((error, doc) => {
        if (error) {
            res.json({ message: "notok" })
        } else {
            res.json({ message: "ok" })
        }

    });

});
// bussness logic get all team
app.get("/teams", (req, res) => {

    console.log("here BL:get all team");
    Team.find().then((data) => {
        res.json({ teams: data, message: "ok" });
    })

});

// bussness logic delete team

app.delete("/teams/:id", (req, res) => {
    console.log("here into delete by id", req.params.id);
    let teamId = req.params.id;

    Team.deleteOne({ _id: teamId }).then(
        (deleteResponse) => {
            console.log("deleteResponse", deleteResponse);
            if (deleteResponse.deletedCount == 1) {
                res.json({ message: "deleted with success" });
            }

        });
});

app.get("/teams/:id", (req, res) => {
    console.log("here BL:get player by id");

    Team.findOne({ _id: req.params.id }).then((data) => {
        res.json({ team: data });
    })

})

// ******************************************************************************
app.post("/weather", (req, res) => {
    console.log("here search by city", req.body);
    let city = req.body.city
    let key = "62ee756a34835483299877a61961cafb";
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    axios.get(apiURL).then(
        (apiResponse) => {
            console.log("here apiResponse", apiResponse.data);
            let data = {
                temperature: apiResponse.data.main.temp,
                sunrise: apiResponse.data.sys.sunrise,
                sunset: apiResponse.data.sys.sunset,
                humidity: apiResponse.data.main.humidity,
                icon:`http://openweathermap.org/img/w/${apiResponse.data.weather[0].icon}.png`
            }
            res.json({ response: data })
        })
});


// make app importable from another files
module.exports = app;
