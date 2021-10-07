const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;




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

const authData = {
    username : 'rlaqudrhks6@gmail.com',
    password : '1234'
}

//passport는 내부에서 session을 사용하기 때문에
//반드시 session아래에 위치해야한다.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done) => {
    console.log('serializeUser',user);
    done(null,user);
})

//페이지에 방문할때마다 밑 함수가 실행되면서 사용자 인가해줌
//그럴때마다 db에서 사용자의 데이터를 조회해서 가져온다.
passport.deserializeUser(function(id,done) {
    console.log('deserializeUser',id);
    done(null,authData);//authData가 원래는 id값을 가지고 db에 있는 사용자의 정보를 가져오는것
    //authData는 받는 함수의 req.user에 유저정보가 담겨져서 보내진다
    //passpoart를 사용할경우 req.user가 활성화된다. 
    //req.user는 아래 passport.use에서 done으로 보낸값이고 
    //따라서 req.user가 있다는 것은 로그인에 성공했다는 의미이다.
})



passport.use(new LocalStrategy(
    {
        usernameField : 'email'
    },
    function(username, password, done) {
        console.log('Localstrategy',username,password);
        if(username === authData.username) {
            if(password === authData.password) {
                console.log("Success to Login");
                return done(null,authData); //여기서 로그인 성공시 authData값이 
                //passport.serializeUser의 user매개변수에 들어간다.
            }
            else
            {
                console.log("Incorret Password");
                return done(null,false ,{message : "Incorret Password"});                
            }
        } 
        else 
        {
            console.log("Incorret Username");
            return done(null,false ,{message : "Incorret Username"});
        }
    }
));




app.post('/login',
    //local은 id 와password를 이용해서 로그인하는것(기본)
    //아래 코드를 적어줌으로써 /login 의 post방식으로 접근됐을때 passport이용함
    passport.authenticate('local', {
        failureRedirect : '/login'
    }),
    //위의 passport전략에서 로그인에 성공되면 아래 코드 실행
    //세션이 저장될때가 있고 안될때까있어서 그냥 세션을 저장하고 그뒤에 홈페이지 위치지정해줌
    (req,res) => {
        req.session.save(() => {
            res.redirect('/index');
        })
    }
 )


app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.use('/register',loguoutRouter);




//세션 값들은 서버가 꺼지면 없어지기 때문에 휘발되지 않도록 하기위해
// 서버에 임의의 장소에 값을 저장해야한다.
app.get('/', (req,res) => {
    mysqlConf.getConnection((err,conn)=> {
        conn.query('select * from topic',(err,result,field) => {
            if(err)throw err;
            console.log(result);
            conn.release();
            res.send("hello");
        })
    })
    
    
})

app.get('/index',(req,res) => {
    console.log("인덱스 로그인",req.user); //deserializeUser의 authData가 req.user에 담겨저 온다
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
