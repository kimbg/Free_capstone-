const mysql = require('mysql');

const shortId = require('shortid');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')//파일 동기방식으로 저장
const adapter = new FileSync('./DB/db.json') //db.json파일에 저장하겠다.
const db = low(adapter)   
db.defaults({users:[]}).write(); //파일에 users라는 배열로 값저장해라

var config1;

config1 = {
    mysql_pool : mysql.createPool({
        host : 'localhost',
        user : 'root',
        password : '2wndeo12#',
        database : 'opentutorials'
    })
}


module.exports = {
    config : config1,
    shortId : shortId,
    lowdb : db
}