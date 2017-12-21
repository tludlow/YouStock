//Module imports
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const mysql = require("mysql");

const app = express();
const port = 3001;
   

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    //res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Content-Length, Authorization");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Cache-Control', 'no-cache');
  next();
});
app.disable('view cache');

//File imports
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

//Setup rest api
app.use("/user", userRoutes);
app.use("/post", postRoutes);

// 404 Error Handler
const endpointError = {status: 404, error: "No Endpoint Found"}
app.use((req, res) => {
    res.send(404, endpointError);
});

var server = http.createServer(app);
server.listen(port);
module.exports = app;