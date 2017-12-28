const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

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
            next();
        } else {
            res.status(200).send({ok: false, error: "Invalid rank on your auth token"});
            return;
        }
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
        var userData = await connection.query("SELECT user_id, username, email, created_at, rank FROM users ORDER BY created_at DESC LIMIT 20");
        var salesData = await connection.query("SELECT sales.sale_id, sales.username, sales.sold_at, posts.title, posts.body, posts.cost FROM sales, posts WHERE sales.post_id = posts.post_id");
        res.status(200).send({ok: true, userData, salesData});
        connection.release();
    } catch (err) {
        res.status(200).send({ok: false, error: "database query error"});
    }
});

router.get("/meow", async (req, res)=> {
    try {
        var connection = await db.getConnection();
        var results= await connection.query("SELECT * FROM sales");
        res.status(200).send({ok: true, results});
    } catch(err) {
        res.status(200).send({ok: false, error: "database query error"});
    }
});


module.exports = router;