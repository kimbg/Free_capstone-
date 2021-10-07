const mysql = require('mysql');
var config;

config = {
    mysql_pool : mysql.createPool({
        host : 'localhost',
        user : 'root',
        password : '2wndeo12#',
        database : 'opentutorials'
    })
}
module.exports = config;