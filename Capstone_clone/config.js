const mysql = require('mysql');
//var session = require('express-session');
//var MySQLStore = require('express-mysql-session')(session);

const info = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '2wndeo12#',
    database : 'opentutorials',

    clearExpired : true , // 만료된 세션 자동 확인 및 지우기 여부: 
	checkExpirationInterval : 900000 ,
})

//var sessionStore = new MySQLStore()

module.exports = {
    _mysql : info,
}