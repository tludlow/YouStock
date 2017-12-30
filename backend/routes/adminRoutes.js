const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const moment = require("moment");

var jwtAuthenticatorAdmin = async (req, res, next)=> {
    const auth = req.get("authorization") || req.get("Authorization");
    if(!auth || typeof auth === "undefined") {
        res.status(200).send({ok: false, error: "Invalid auth token"});
        return;
    }
    const token = auth.split(" ")[1]; //come in the form Bearer TOKENHERE, we only want the TOKENHERE bit.
    try {
        var decodedToken = await jwt.verify(token, config.jwtSecret);
        if(decodedToken.rank == "admin") {
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
        } else {
            res.status(200).send({ok: false, error: "Invalid rank on your auth token"});
            return;
        }
    } catch (err) {
        res.status(200).send({ok: false, error: "Invalid auth token"});
    }
};

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
        
    } catch (err) {
        res.status(200).send({ok: false, error: "Invalid auth token"});
    }
};

//Used to make sure the user trying to access the page is able to recieve data back from this endpoint.
//If they can they are an admin and we return ok == true if not they are just a user and we return ok == false.
router.get("/adminCheck", jwtAuthenticatorAdmin, (req, res)=> {
    res.status(200).send({ok: true, hello: "hello"});
});


router.get("/getData", jwtAuthenticatorAdmin, async (req, res)=> {
    try {
        var connection = await db.getConnection();
        var userData = await connection.query("SELECT user_id, username, email, created_at, rank FROM users ORDER BY created_at, rank DESC LIMIT 20");
        var salesData = await connection.query("SELECT sales.sale_id, sales.username, sales.sold_at, posts.title, posts.body, posts.cost FROM sales, posts WHERE sales.post_id = posts.post_id");
        res.status(200).send({ok: true, userData, salesData});
        
    } catch (err) {
        res.status(200).send({ok: false, error: "database query error"});
    } finally {
        connection.release();
    }
});

router.post("/removePost", jwtAuthenticatorAdmin, async (req, res)=> {
    var {reason, offender, post_id, removed_by, shouldBan, banLength} = req.body;
    if(typeof shouldBan != "undefined") {
        var unbanDate;
        if(banLength == 1 ){
            unbanDate = moment().add(1, "days").format('YYYY-MM-DD HH:mm:ss');
        }
        if(banLength == 2) {
            unbanDate = moment().add(7, "days").format('YYYY-MM-DD HH:mm:ss');
        }
        if(banLength == 3) {
            unbanDate = moment().add(500, "years").format('YYYY-MM-DD HH:mm:ss');
        }
        try {
            var connection = await db.getConnection();
            var checkQuery = await connection.query("SELECT rank FROM users WHERE username = ?", [offender]);
            if(checkQuery[0].rank == "admin") {
                res.status(200).send({ok: false, error: "You cannot ban other administrators."});
                return;
            }
            var query = await connection.query("UPDATE posts SET removed = 1 WHERE post_id = ?", [post_id]);
            var query2 = await connection.query("INSERT INTO post_removals (post_id, reason, removed_by) VALUES(?, ?, ?)", [post_id, reason, removed_by]);
            var query3 = await connection.query("INSERT INTO bans (username, banned_by, reason, unban_date) VALUES(?, ?, ?, ?)", [offender, removed_by, reason, unbanDate]);
            var query4 = await connection.query("UPDATE users SET banned = 1 WHERE username = ?", [offender]);
            res.status(200).send({ok: true});
        } catch (err) {
            res.status(200).send({ok: false, error: "An error occured removing that post from the database."});
        } finally {
            connection.release();
        }
    } else {
        try {
            var connection = await db.getConnection();
            var query = await connection.query("UPDATE posts SET removed = 1 WHERE post_id = ?", [post_id]);
            var query2 = await connection.query("INSERT INTO post_removals (post_id, reason, removed_by) VALUES(?, ?, ?)", [post_id, reason, removed_by]);
            res.status(200).send({ok: true});
        } catch (err) {
            res.status(200).send({ok: false, error: "An error occured removing that post from the database."});
        } finally {
            connection.release();
        }
    }
});

router.get("/getRemovalInfo/:post", jwtAuthenticatorAdmin, async (req, res)=> {
    const postID = req.params.post;
    try {
        var connection = await db.getConnection();
        var query = await connection.query("SELECT post_id, title, posted_by, removed FROM posts WHERE post_id = ?", [postID]);
        if(query[0].removed == 1) {
            var query2 = await connection.query("SELECT reason FROM post_removals WHERE post_id = ?", [postID]);
            res.status(200).send({ok: false, error: "That post has already been removed from the database. Reason: " + query2[0].reason});
        } else {
            res.status(200).send({ok: true, post_id: query[0].post_id, title: query[0].title, posted_by: query[0].posted_by});
        }
    } catch (err) {
        res.status(200).send({ok: false, error: "An error occured finding that post in the database."});
    } finally {
        connection.release();
    }
});


module.exports = router;