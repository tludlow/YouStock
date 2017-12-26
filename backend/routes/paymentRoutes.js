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
    const { name, address, postcode, username, post_id, title } = req.body;
    const token = req.body.stripeToken;
    var cost = 0;

    //get the cost of the item they want to buy from the database.
    db.getConnection((err, connection)=> {
        if(err) {
            res.status(200).send({ok: false, error: "There was an error, please try again. stage 1"});
            throw err;  
            return;    
        }
        connection.query("SELECT cost, sold FROM posts WHERE post_id = ?", [post_id], (err, results, fields)=> {
            if(err) {
                res.status(200).send({ok: false, error: "There was an error, please try again. stage 2"});
                throw err;  
                return;   
            }
            if(results[0].sold == 1) {
                res.status(200).send({ok: false, error: "Somebody already purchased this item, unlucky."});
                return;
            }
            cost = Math.ceil((results[0].cost) * 100);
            stripe.charges.create({
                amount: cost,
                currency: "gbp",
                description: "Purchase of " + title + " through YouStock",
                metadata: {id: post_id, title, purchaser_token: req.get("authorization") || req.get("Authorization"), username, name, address, postcode},
                source: token,
            }, function(err, charge) {
                if(err) {
                    console.log(err);
                    res.status(200).send({ok: false, error: "An error occured, stage 3"});
                    return;
                } else {
                    if(charge.status != "succeeded" || charge.paid == false) {
                        res.status(200).send({ok: false, error: "The payment was not successful."}); 
                    } else {
                        connection.query("UPDATE posts SET sold = 1 WHERE post_id = ?", [post_id], (err, results, fields)=>{
                            if(err) {
                                res.status(200).send({ok: false, error: "An error occured, stage 4"});
                                throw err;  
                                return;    
                            } else {
                                res.status(200).send({ok: true, message: "payment completed for " + charge.description});
                                let dataInsert = {post_id, username, name, address, postcode};
                                connection.query("INSERT INTO sales SET ?", dataInsert, (err, results, fields)=> {
                                    if(err) throw err;

                                });
                                return;
                            }
                        });
                    }
                }
                
            });
            
        });
        connection.release();
    });    
});




module.exports = router;