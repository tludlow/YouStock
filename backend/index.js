//Module imports
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const db = require("./database");
const cron = require("node-cron");
const moment = require("moment");

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

//Run every day at 1 second past 12 at night.
cron.schedule('01 00 00 * * *', async function() {
    try {
        var connection = await db.getConnection();
        var gottenBans = await connection.query("SELECT ban_id, username, unban_date FROM bans WHERE active = 1");
        var currentDate = moment();
        console.log("Running unban scheduler - " + currentDate.format("YYYY-MM-DD HH-mm-ss"));
        
        gottenBans.forEach(async element => {
            var unbanDate = moment(element.unban_date);
            var difference = unbanDate.diff(currentDate, "days");
            if(unbanDate.isSame(currentDate, "day")) {
                //Unban the user.
                console.log("Unbanned User: " + element.username);
                var unbanQuery1 = await connection.query("UPDATE bans SET active = 0 WHERE ban_id = ?", [element.ban_id]);
                var unbanQuery2 = await connection.query("UPDATE users SET banned = 0 WHERE username = ?", [element.username]);
            }
        });
    } catch (err) {
        console.log(err);
    } finally {
        connection.release();
    }

});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

var server = http.createServer(app);
server.listen(port);
module.exports = app;