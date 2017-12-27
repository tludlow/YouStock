const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");
const config = require("../config/config");


var jwtAuthenticator = async (req, res, next)=> {
    const auth = req.get("authorization");
    if(!auth || typeof auth === "undefined") {
        res.status(200).send({ok: false, error: "Invalid auth token"});
        return;
    }
    const token = auth.split(" ")[1]; //come in the form Bearer TOKENHERE, we only want the TOKENHERE bit.
    try {
        var decodedToken = await jwt.verify(token, config.jwtSecret);
        next();
    } catch (err) {
        res.status(200).send({ok: false, error: "Invalid auth token"});
    }
};

router.get("/createTest", (req,res)=> {
    data = {username: "ThomasGangasd", email: "thomasiscsasdasddasdool@test.net", password: "asdasd@123as212qas."};
    db.getConnection(function(err, connection) {
        connection.query("INSERT INTO users SET ?", data, (err, results, fields) => {
            if (err) throw err;
        });
        connection.release();
    });
    res.status(200).send(data);
});

router.get("/getUser/:username", (req,res)=> {
    const username = req.params.username;
    var gottenUser = {};
    db.getConnection(function(err, connection) {
        connection.query("SELECT username, email FROM users WHERE username = ?", [username], (err, results, fields) => {
            if (err) throw err;

            res.status(200).send(results);
        });
        connection.release();
    });
});

var generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
var validPassword = function(password, hash){
    return bcrypt.compareSync(password, hash);
}

router.post("/signup", (req, res)=> {
    const { username, email, password } = req.body;
    const toInsert = {username, email, password: generateHash(password)};
    db.getConnection((err, connection)=> {
        connection.query("SELECT COUNT(*) AS count FROM users WHERE username = ? or email = ?", [username, email], (err, results, fields)=> {
            if(results[0].count > 0) {
                console.log("Username or email already exists!");
                res.status(200).send({ok: false, error: "A user with that username or email already exists in the system."});
            } else {
                connection.query("INSERT INTO users SET ?", toInsert, (err, results, fields)=> {
                    if (err) throw err;
                    let dataJWT = {username, email, rank: "user", iat: Math.floor(Date.now() / 1000) - 30};
                    const token = jwt.sign(dataJWT, config.jwtSecret);
                    res.status(200).send({ok: true, username, email, token, rank: "user"});
                });
            }
        });
        connection.release();
    });
});

router.post("/login", (req, res)=> {
    const { username, password } = req.body;
    db.getConnection((err, connection)=> {
        connection.query("SELECT username, email, password, rank, banned FROM users WHERE username = ?", [username], (err, results, fields)=> {
            if(results.length == 0) {
                res.status(200).send({ok: false, error: "No user with that username exists."});
            } else {
                let returned = {
                    username: results[0].username,
                    email: results[0].email,
                    passwordHash: results[0].password,
                    banned: results[0].banned,
                    rank: results[0].rank
                };
                if(returned.banned == 1) {
                    connection.query("SELECT reason, unban_date FROM bans WHERE username = ?", [username], (err, results, fields)=> {
                        console.log(results);
                        res.status(200).send({ok: false, error: "You have been banned.", reason: results[0].reason, unban_date: results[0].unban_date});
                    });
                } else {
                    if(validPassword(password, returned.passwordHash)) {
                        //login
                        let dataJWT = {username: returned.username, email: returned.email, rank: returned.rank, iat: Math.floor(Date.now() / 1000) - 30};
                        const token = jwt.sign(dataJWT, config.jwtSecret);
                        res.status(200).send({ok: true, username, token, rank: returned.rank});
                    } else {
                        //warn error
                        res.status(200).send({ok: false, error: "Incorrect login details have been provided"});
                    }
                }
            }
        });
        connection.release();
    });
});

router.get("/profile/:name", (req,res)=> {
    const name = req.params.name;
    db.getConnection((err, connection)=> {
        connection.query("SELECT username, rank, created_at FROM users WHERE username = ?", [name], (err, results, fields)=> {
            if(err) {
                res.status(200).send({ok: false, error: "An error occured querying the data for your profile."});
                return;
            }
            res.status(200).send({ok: true, profile: results[0]});
        });
        connection.release();
    });
});




module.exports = router;