const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const stripe = require("stripe")(config.stripeSecret);

var jwtAuthenticator = async (req, res, next)=> {
    const auth = req.get("authorization") || req.get("Authorization");
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

router.post("/charge", jwtAuthenticator, (req, res)=> {
    const token = req.body.stripeToken;
    const post_id = req.body.post_id;
    const title = req.body.title;

    stripe.charges.create({
        amount: 1000,//TODO
        currency: "gbp",
        description: "Purchase of " + title + " through YouStock",
        source: token,
    }, function(err, charge) {
        if(err) {
            res.status(200).send({ok: false, error: err});
            return;
        } else {
            if(charge.status != "succeeded" || charge.paid == false) {
                res.status(200).send({ok: false, error: "The payment was not successful."}); 
            } else {
                db.getConnection((err, connection)=> {
                    if(err) {
                        res.status(200).send({ok: false, error: "Please contact support with the code: " + charge.id});
                        throw err;  
                        return;    
                    }
                    connection.query("UPDATE posts SET sold = 1 WHERE post_id = ?", [post_id], (err, results, fields)=>{
                        if(err) {
                            res.status(200).send({ok: false, error: "Please contact support with the code: " + charge.id});
                            throw err;  
                            return;    
                        } else {
                            res.status(200).send({ok: true, message: "payment completed for " + charge.description});
                            return;
                        }
                    });
                    connection.release();
                });    
            }
        }
        
    });
});




module.exports = router;