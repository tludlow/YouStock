const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config");

var jwtAuthenticator = async (req, res, next)=> {
    const auth = req.get("authorization");
    if(!auth || typeof auth === "undefined") {
        res.status(200).send({ok: false, error: "Invalid auth token"});
        return;
    }
    const token = auth.split(" ")[1]; //come in the form Bearer TOKENHERE, we only want the TOKENHERE bit.
    try {
        var decodedToken = await jwt.verify(token, jwtSecret);
        next();
    } catch (err) {
        console.log(err);
        res.status(200).send({ok: false, error: "Invalid auth token"});
    }
};

router.post("/create", jwtAuthenticator, (req,res)=> {
    const { title, body, image, posted_by } = req.body;
    const toInsert = {
        title,
        body,
        image,
        posted_by
    };
    db.getConnection((err, connection) => {
        if (err) throw err;
        db.query("INSERT INTO posts SET ?", toInsert, (err, results, fields)=> {
            if (err) throw err;
            res.status(200).send({ok: true, title, body, posted_by, image});
        });
    });
});




module.exports = router;