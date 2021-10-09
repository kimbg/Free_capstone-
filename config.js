const mysql = require('mysql');

const shortId = require('shortid');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')//파일 동기방식으로 저장
const adapter = new FileSync('./DB/db.json') //db.json파일에 저장하겠다.
const db = low(adapter)
db.defaults({ users: [] }).write(); //파일에 users라는 배열로 값저장해라

var config1;

config1 = {
    mysql_pool: mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '2wndeo12#',
        database: 'opentutorials'
    })
}

const credentials = {
   
    "client_id": "609634944443-e9fkhksuenglt9ogtjdhbl6afkb2u18d.apps.googleusercontent.com",
    "project_id": "opentutorials-328504",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "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", "redirect_uris": ["http://localhost:3000/auth/google/callback"],
    "javascript_origins": ["http://localhost:3000"]    
}

const credentials2 = {
    cleitID : '2a8f2e28d03826a91690db36ea52acb9',
    callbackURL : 'http://localhost:3000/auth/kakao/callback'
}


module.exports = {
    config: config1,
    shortId: shortId,
    lowdb: db,
    googleCredentials : credentials,
    kakaoCredentials : credentials2
}