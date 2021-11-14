var express = require('express');
var app = express();
var mysql = require('./config')._mysql;
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const multer = require('multer');
const fs = require('fs');
const _storage = multer.diskStorage({
    destination : (req,file,cb)=> {cb(null,__dirname+'/Image')},
    //destination안에서 파일 형식 즉 이미지 혹은 텍스트에 따라 
    //다른 폴더에 저장하도록 가능
    filename : (req,file,cb)=> {

        let fname = file.originalname;        
        let photoType = ['.jpg','.png','.bmp','.gif'];
        let i = 0;
        let swit = true;

        for(let j = 0 ; j < photoType.length; j++)
        {
            if(fname.indexOf(photoType[j]) != -1) {
                let firstName = fname.substr(0,fname.indexOf(photoType[j]));

                if(__dirname + `/Image/${fname}`) {      
                    while(swit){                        
                        try {
                            fs.statSync(__dirname + `/Image/${fname}`)                            
                            i++;
                            fname = firstName + `(${i})` + photoType[j];
                        }
                        catch(err) {
                            swit = false;
                            cb(null,fname);
                        }
                    }                                        
                }
                else cb(null,fname);
                break;
            }
        }
    }
    //filename에서는 동일이름 파일 같은 작업 if로 처리가능
})
const upload = multer({storage : _storage}); //multer를 위한 변수
//dest는 저장할 폴더의 이름이다.
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
//app.use('/auth/*',authRouter.google);
//app.use('/auth/google',authRouter.google);
//app.use('/auth/kakao',authRouter.kakao);

///*testcode

app.use('/image',express.static('Image'));
//위와 같이 작성시 /image로 접근할경우 Image/폴더에서 파일 바로 갓다씀
//https://opentutorials.org/course/2136/11959 14분 참고


app.get('/upload',(req,res)=> {
    res.sendFile(__dirname + '/Front/html/test.html');
})

//upload.single('imgFile')을 통해 req에 file객체가 생성된다
//imgFile은 html의 input 의 name과 일치시켜야한다.
// app.post('/upload',upload.single('imgFile'),(req,res)=> {
//     console.log("client send me some image");
// })
app.post('/upload',(req,res)=> {
    upload(rqe,res,(err)=> {
        if(err instanceof multer.MulterError) {
            console.log(err);
        }
    })

})


/*
app.get('/image/:id',(req,res)=> {
    
    res.sendFile(__dirname + `/Image/${req.params.id}.jpg`);
})
*/

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
    var fname = "채용담당자(2).png";
    var photoType = '.png';
    var i = 0;
    try {
        fs.statSync(__dirname + `/Image/${fname}`);
        console.log('있다');
    }catch(err){
        console.log('없다');
    }

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

