var express = require('express');
var app = express();
var mysql = require('./config')._mysql;
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
require('dotenv').config();

// session 을 생성하고 db 에 저장
app.use(session({
	secret              : 'secret',
	resave              : false,
	saveUninitialized   : true, //이거false시 세션 데이터가 저장이 안되서 true로 바꿔놨음
    store : new MySQLStore({
        host : 'localhost',
        user : 'root',
        password : '2wndeo12#',
        database : 'opentutorials'
    })
}));

app.use(express.static('Front/'));
app.use(express.urlencoded({extended:false}));
const passport = require('./passport')(app);



app.use('/login',loginRouter);
app.use('/join',registerRouter);
//아래 두코드는 보류
//app.use('/auth/google',authRouter.google);
//app.use('/auth/kakao',authRouter.kakao);

///*testcode

app.get('/image/:id',(req,res)=> {
    
    res.sendFile(__dirname + `/Image/${req.params.id}.jpg`);
})

app.post('/receiveDbLength',(req,res)=> {
    var cnt = 0;
    console.log("receiveDbLength ajax receive!");
    mysql.getConnection((err,conn)=> {
        conn.query(`select count(*) as length from noticeBoard`,(err,result)=> {
            if(err){
                console.log(err);
                console.log('err1');
            }
            else if(!result[0]) {
                console.log("결과 없음");
            }
            else cnt = result[0].length;
            conn.release();
            res.status(200).send(cnt.toString());
        })
    })  
})

app.post('/sendajax',(req,res)=> {

    console.log("receive ajax!");
    mysql.getConnection((err,conn)=> {
        conn.query(`select * from noticeBoard where num = ?`,[req.body.num],(err,result)=> {
            if(err){
                console.log(err);                
                sendData = 'noData';
                //return res.redirect('/login');
            }
            else if(!result[0]){
                console.log('결과 없음');
                sendData = 'noData';
                //return res.json({data : null});
            }
            else sendData = result;

            console.log(result);
            conn.release();
            //res.json({data : sendData});
            res.send(sendData);
        })
    })  
    /*
    console.log("json data : ",req.body.num);
    var sendData;
    mysql.getConnection((err,conn)=> {
        conn.query(`select * from noticeBoard where num = ?`,[req.body.num],(err,result)=> {
            if(err){
                console.log(err);                
                sendData = 'noData';
                //return res.redirect('/login');
            }
            else if(!result[0]){
                console.log('결과 없음');
                sendData = 'noData';
                //return res.json({data : null});
            }
            else sendData = result;

            console.log(result);
            conn.release();
            //res.json({data : sendData});
            res.send(sendData);
        })
    })  
    */
    
})



//*///testcode


//메인 페이지
app.get('/', (req, res)=> {
  res.redirect('/login');
})

app.get('/main',(req,res)=>{
    res.sendFile(__dirname + '/Front/html/mainTest.html');
})

//로그아웃
app.get('/logout', (req, res)=> {
    req.session.destroy(() => {
        res.redirect('/login');
    });
    /*
    delete req.session.is_logined;
    req.session.save(() => {
        res.redirect('/login');
    });
    */
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

