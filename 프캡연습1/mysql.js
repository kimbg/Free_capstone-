const mysql = require('mysql');
const template = require('./login');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '2wndeo12#',
    database : 'opentutorials'
});

connection.connect();

connection.query('SELECT * FROM topic',(err,result,fields) => { //앞의 쿼리문이 실행되고 뒤 콜백함수가 실행됨
    if(err) {
        console.log(err);
    }
    console.log(result);
})

connection.end();