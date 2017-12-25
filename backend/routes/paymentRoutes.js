const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const stripe = require("stripe")(config.stripeSecret);

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

router.post("/charge", (req, res)=> {
    const token = req.body.stripeToken;
    console.log("In here");
    stripe.charges.create({
        amount: 1000,
        currency: "gbp",
        description: "Example charge",
        source: token,
    }, function(err, charge) {
        if(err) {
            res.status(200).send({ok: false, error: err});
            return;
        } else {
            res.status(200).send({ok: true, message: "payment complete"});
            return;
        }
        
    });
});




module.exports = router;