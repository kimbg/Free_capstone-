var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
const FileStore = require('session-file-store')(session);

var app = express()

//이 middleware가 req.session property에 값 저장한다.
app.use(session({
  secret: 'keyboard cat',
  resave: false, //세션 데이터가 바뀌기전에 세션 값을 변하지않는게 false
  saveUninitialized: true, //세션이 필요하기전까지 세션을 구동하지 않는다.
  store : new FileStore()
}))

app.get('/', function (req, res, next) {
    console.log(req.session);
    if(req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num += 1;
    }
    res.send(`Views : ${req.session.num}`);
    //세션은 자신의 메모리에 저장한다 (휘발성)
})

app.listen(3000,(req,res)=> {
    console.log(3000);
})