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
        //Check if the user is banned.
        try {  
            var connection = await db.getConnection();
            var query = await connection.query("SELECT COUNT(*) AS count FROM bans WHERE username = ?", [decodedToken.username]);
            if(query[0].count > 0) {
                res.status(200).send({ok: false, error: "You have been banned. Logout of your account and try and log in again to see why."});
            } else {
                next();
            }
        } catch (err) {
            res.status(200).send({ok: false, error: "An error occured processing your auth token."});
        } finally {
            connection.release();
        }
    } catch (err) {
        res.status(200).send({ok: false, error: "Invalid auth token"});
    }
};

var generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
var validPassword = function(password, hash){
    return bcrypt.compareSync(password, hash);
}


router.post("/signup", async (req, res)=> {
    const { username, email, password } = req.body;
    const toInsert = {username, email, password: generateHash(password)};

    var connection = await db.getConnection();
    try {
        var doesUserExist = await connection.query("SELECT COUNT(*) AS count FROM users WHERE username = ? or email = ?", [username, email]);

        if(doesUserExist[0].count > 0) {
            res.status(200).send({ok: false, error: "A user with that username or email already exists in the system."});
            return;
        }

        var insertingUser = await connection.query("INSERT INTO users SET ?", toInsert);
        let dataJWT = {username, email, rank: "user", iat: Math.floor(Date.now() / 1000) - 30};
        const token = jwt.sign(dataJWT, config.jwtSecret);

        
        res.status(200).send({ok: true, username, email, token, rank: "user"});
    } catch(err) {
        res.status(200).send({ok: false, error: "An error occured signing your user up."});
    } finally {
        connection.release();
    }
});

router.post("/login", async (req, res)=> {
    const { username, password } = req.body;
    try {
        var connection = await db.getConnection();
        var checkForUser = await connection.query("SELECT username, email, password, rank, banned FROM users WHERE username = ?", [username]);
        if(checkForUser.length == 0) {
            res.status(200).send({ok: false, error: "No user with that username exists."});
            return;
        }

        let returned = {
            username: checkForUser[0].username,
            email: checkForUser[0].email,
            passwordHash: checkForUser[0].password,
            banned: checkForUser[0].banned,
            rank: checkForUser[0].rank
        };
        if(returned.banned == 1) {
            var getReasonAndUnban = await connection.query("SELECT reason, unban_date FROM bans WHERE username = ?", [username]);
            res.status(200).send({ok: false, error: "You have been banned.", reason: getReasonAndUnban[0].reason, unban_date: getReasonAndUnban[0].unban_date});
        } else {
            if(validPassword(password, returned.passwordHash)) {
                let dataJWT = {username: returned.username, email: returned.email, rank: returned.rank, iat: Math.floor(Date.now() / 1000) - 30};
                const token = jwt.sign(dataJWT, config.jwtSecret);
                res.status(200).send({ok: true, username, token, rank: returned.rank});
            } else {
                res.status(200).send({ok: false, error: "Incorrect login details have been provided"});
            }
        }

    } catch(err) {
        res.status(200).send({ok: false, error: "There was an error logging your account into the system."});
    } finally {
        connection.release();
    }
});

router.get("/profile/:name", async (req,res)=> {
    const name = req.params.name;
    try {
        var connection = await db.getConnection();
        var gottenProfile = await connection.query("SELECT username, rank, created_at FROM users WHERE username = ?", [name]);
        res.status(200).send({ok: true, profile: gottenProfile[0]});
    } catch(err) {
        res.status(200).send({ok: false, error: "An error occured querying the data for your profile."});
    } finally {
        connection.release();
    }
});




module.exports = router;