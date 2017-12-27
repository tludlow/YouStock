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

router.get("/adminCheck", jwtAuthenticatorAdmin, (req, res)=> {
    res.status(200).send({ok: true, hello: "hello"});
});





module.exports = router;