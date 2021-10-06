const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const template = require('../template');



router.use(cookieParser());



router.get('/',(req,res,isLogin)=> {
    res.sendFile('C:/Users/김병관/Desktop/capstone_practice/login.html');
})






//원래는 아래코드가 맞지만 passport사용을 위해 주석처리 
//기본 Router버전
// router.post('/',(req,res)=> {
//     var someondId = 0;
//     someondId++;
//     var email = req.body.email;
//     var pw = req.body.password;
//     console.log(req.session);
//     if(email === "123@123" && pw === "123") { //로그인 성공
//         req.session.is_logined = true;
//         req.session.nickname = "kbk";
//         var html = template.HTML(req.session.nickname);
//         res.send(html);
//     }else if(email === "123@1234" && pw === "123") {
//         req.session.is_logined = true;
//         req.session.nickname = "bk_kim";
//         var html = template.HTML(req.session.nickname);
//         res.send(html);
//     } else { //로그인 실패
//         req.session.is_logined = true;
//         req.session.nickname = `someone${someondId}`;
//         res.send("Welcome");
//     }
     
// })


// router.post('/',(req,res)=> {
//     console.log("요청하는 쿠키의 값은>?");
//     console.log(req.cookies);

//     res.cookie("user_id",req.body.email);
//     res.cookie("user_pw",req.body.password);
//     res.send("hello");
//     //const user_Email = authData.Email;
//     //const user_pw = authData.pw;
//     // if(user_Email === req.body.email && user_pw === req.body.password) {
//     //     req.session.is_logined = true;
//     //     req.session.nickname = "bk kim";
//     //     res.send("Welcome");
//     // } else {
//     //     res.send("cannot access");
//     // }
// })

/*
router.post('/',(req,res)=> {
    //이부분에서 DB와 아이디,pw를 검사해서 통과하는 단계
    // if(req.body.email == "123@123" && req.body.password == "1234")
    // {
    //     //이렇게하면 쿠키로 입력한 아이디와 입력한 페스워드 2개가 구워
    //     //져서 쿠키로 전송된다.
    //     res.cookie("user_id",req.body.email);
    //     res.cookie("user_pw",req.body.password);
    //     res.redirect('/index');
    // }
    // else //로그인 실패시
    // {
    //     res.cookie("user_id",req.body.email);
    //     res.cookie("user_pw",req.body.password);
    //     res.redirect("/login");
    // }
    // console.log(req.cookies);
    // console.log("쿠키의 특정쿠키 출력가능?");
    // console.log(req.cookies.user_id);
})
*/
module.exports = router;