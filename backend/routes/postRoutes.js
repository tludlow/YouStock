const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config");
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
        var decodedToken = await jwt.verify(token, jwtSecret);
        next();
    } catch (err) {
        console.log(err);
        res.status(200).send({ok: false, error: "Invalid auth token"});
    }
};

router.post("/create", upload.single("image"), (req,res)=> {
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




module.exports = router;