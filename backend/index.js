//Module imports
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const db = require("./database");
var cors = require('cors')

const app = express();
const port = 3001;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors());

//File imports
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

//Setup rest api
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/payment", paymentRoutes);
app.use("/admin", adminRoutes);

// 404 Error Handler
const endpointError = {status: 404, error: "No Endpoint Found"}
app.use((req, res) => {
    res.status(404).send(endpointError);
});


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

var server = http.createServer(app);
server.listen(port);
module.exports = app;