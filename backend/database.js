var mysql = require('promise-mysql');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createPool({
            connectionLimit : 10,
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            database : 'yousell',
            //debug: ['ComQueryPacket']
          });
    }
    return db;
}

module.exports = connectDatabase();