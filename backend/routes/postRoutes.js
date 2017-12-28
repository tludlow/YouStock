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

//Probably can make this async/await but I think it will be fine the way it is.
router.post("/create", jwtAuthenticator, upload.single("image"), async (req,res)=> {
    const { title, body, posted_by, token, cost } = req.body;
    var newFileName = `${new Date().getTime()}-${req.file.originalname}`
    const toInsert = {title, body, image: newFileName, posted_by, cost};

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

    try {
        var connection = await db.getConnection();
        let insertImage = await connection.query("INSERT INTO posts SET ?", toInsert);
        res.status(200).send({ok: true});
    } catch (err) {
        res.status(200).send({ok: false, error: "An error occured inserting your file into the database."});
    } finally {
        connection.release();
    }
});

router.get("/frontpage/:page", async (req, res)=> {
    const page = parseInt(req.params.page);
    const limit = 20;
    if(page == 1) {
        try {
            var connection = await db.getConnection();
            let results = await connection.query("SELECT * FROM posts WHERE removed = 0 ORDER BY posted_at DESC LIMIT ?", [limit]);
            if(results.length == 0) {
                res.status(200).send({ok: false, error: "No posts exist!"});
                return;
            } else {
                res.status(200).send({ok: true, results});
            }
        } catch (err) {
            res.status(200).send({ok: false, error: "An error occured seleting the data."});
        } finally {
            connection.release();
        }
    } else {
        try {
            let offsetPage = parseInt((page - 1) * limit);
            var connection = await db.getConnection();
            let results = await connection.query("SELECT * FROM posts WHERE removed = 0 AND sold = 0 ORDER BY posted_at DESC LIMIT ? OFFSET ?", [limit, offsetPage]);
            if(results.length == 0) {
                res.status(200).send({ok: false, error: "There are no more posts in the database."});
                return;
            } else {
                res.status(200).send({ok: true, results, page: page + 1});
            }
        } catch (err) {
            res.status(200).send({ok: false, error: "An error occured seleting the data."});
        } finally {
            connection.release();
        }
    }
});

router.get("/:id", async (req, res)=> {
    const wantedPost = req.params.id;
    try {
        var connection = await db.getConnection();
        let results1 = await connection.query("SELECT * FROM posts WHERE post_id = ?", [wantedPost]);
        if(results1.length == 0) {
            res.status(200).send({ok: false, error: "There was no post found with that id."});
            return;
        } else {
            if(results1[0].removed == 1) {
                res.status(200).send({ok: false, error: "That post has been removed due to a moderation action."});
                return;
            }
            let results2 = await connection.query("SELECT * FROM comments WHERE post_id = ? ORDER BY posted_at ASC", [wantedPost]);
            if(results2.length == 0) {
                res.status(200).send({ok: true, commentCount: 0, post: results1[0]});
                return;
            } else {
                res.status(200).send({ok: true, post: results1[0], commentCount: results2.length, comments: results2});
                return;
            }
        }
    } catch (err) {
        res.status(200).send({ok: false, error: "An error occured selecting the post data."});
    } finally {
        connection.release();
    }
});

router.post("/createComment", jwtAuthenticator, async (req, res)=> {
    const { text, user, post } = req.body;
    let data = {post_id: post, text, posted_by: user};
    try {
        var connection = await db.getConnection();
        let insertData = await connection.query("INSERT INTO comments SET ?", data);
        res.status(200).send({ok: true, comment: results});
    } catch(err) {
        res.status(200).send({ok: false, error: "There was an error creating a comment."});
    } finally {
        connection.release();
    }
});




module.exports = router;