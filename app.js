const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const shortId = require('./config').shortId;
const lowdb = require('./config').lowdb;
 


const port = process.env.port || 3000;
const cookieParser = require('cookie-parser');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const loguoutRouter = require('./routes/logout');
const template = require('./login');

const mysqlConf = require('./config.js').mysql_pool;


app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


//session 미들웨어를 정의 함으로써 req.session에 값을 추가해준다.
app.use(session({
    secret: 'keyboard cat',
    resave: false, //세션 데이터가 바뀌기전에 세션 값을 변하지않는게 false
    saveUninitialized: true, //세션이 필요하기전까지 세션을 구동하지 않는다.
    store : new FileStore()//파일 저장은 Default로 sessions라는 폴더에 들어간다.
}))



var passport = require('./lib/passport')(app);






app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.use('/logout',loguoutRouter);




//세션 값들은 서버가 꺼지면 없어지기 때문에 휘발되지 않도록 하기위해
// 서버에 임의의 장소에 값을 저장해야한다.
app.get('/', (req,res) => {
    // mysqlConf.getConnection((err,conn)=> {
    //     conn.query('select * from topic',(err,result,field) => {
    //         if(err)throw err;
    //         console.log(result);
    //         conn.release();
    //         res.send("hello");
    //     })
    // })
    res.send(req.user);
})

app.get('/index',(req,res) => {
    console.log("인덱스 로그인",req.user); //deserializeUser의 authData가 req.user에 담겨저 온다

    lowdb.get('users').push({
        id : shortId.generate(),
        name : req.user.username,
        pwd : req.user.password        
    }).write();
    res.sendFile(__dirname + '/index.html');
})

//이렇게 하면 /register/1번째값/2번째값
//위 에 1번째값과 2번쨰값의 링크에 온 각각의 값을 pageId와 chapterID의 
//이름으로 저장해서 req.params에 저장해 사용할 수 있도록 한다
app.get('/register/:pageID/:ChapterID',(req,res)=> {
    res.send(req.params);
    
})





app.listen(port, (req,res) => {
    console.log("The server is listening..");
})
