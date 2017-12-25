const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const multer = require("multer");
const upload = multer({ dest: __dirname + './../public/img/uploads' });
const fs = require("fs");
const path = require("path");

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

router.post("/create", jwtAuthenticator, upload.single("image"), (req,res)=> {
    const { title, body, posted_by, token, cost } = req.body;
    var newFileName = `${new Date().getTime()}-${req.file.originalname}`
    const toInsert = {
        title,
        body,
        image: newFileName,
        posted_by,
        cost
    };
    fs.readFile(req.file.path, function (err, data) {
        var imageName = req.file.originalname;
        if(!imageName){
            res.status(200).send({ok: false, error: "There was an error with the image name."});
        } else {
            var newPath = path.join(__dirname + "./../public/img/uploads/" + newFileName);
            fs.writeFile(newPath, data, function (err) {
                if(err) {
                    res.status(200).send({ok: false, error: "There was an error with the image name."});
                }
            });
            fs.unlink(req.file.path);
        }
    });
    db.getConnection((err, connection) => {
        if (err) throw err;
        db.query("INSERT INTO posts SET ?", toInsert, (err, results, fields)=> {
            if (err) throw err;
            res.status(200).send({ok: true});
        });
        connection.release();
    });
});

router.get("/frontpage", (req, res)=> {
    db.getConnection((err, connection)=> {
        connection.query("SELECT * FROM posts WHERE removed = 0 ORDER BY posted_at DESC LIMIT 30", (err, results, fields)=> {
            if (err) throw err;
            if(results.length == 0) {
                res.status(200).send({ok: false, error: "No posts exist!"});
                return;
            } else {
                res.status(200).send({ok: true, results});
            }
        });
        connection.release();
    });
});

router.get("/:id", (req, res)=> {
    const wantedPost = req.params.id;
    db.getConnection((err, connection)=> {
        connection.query("SELECT * FROM posts WHERE post_id = ?", [wantedPost], (err, results1, fields)=> {
            if (err) throw err;
            if(results1.length == 0) {
                res.status(200).send({ok: false, error: "There was no post found with that id."});
                return;
            } else {
                if(results1[0].removed == 1) {
                    res.status(200).send({ok: false, error: "That post has been removed due to a moderation action."});
                    return;
                }
                connection.query("SELECT * FROM comments WHERE post_id = ? LIMIT 5", [wantedPost], (err, results2, fields)=> {
                    if(results2.length == 0) {
                        res.status(200).send({ok: true, post: results1[0]});
                        return;
                    } else {
                        res.status(200).send({ok: true, post: results1[0], commentCount: results2.length, comments: results2});
                        return;
                    }
                });
            }
        });
        connection.release();
    });
});




module.exports = router;