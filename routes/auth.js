const express = require('express');
const router = express.Router();
const passport = require('../passport')(router);

const GoogleRouter = express.Router();
const KakaoRouter = express.Router();

/* 이파일은 일단 보류 /auth관련해서 routes로 passport와 분리하려 시도했지만
    Router의 숙련도 미달인지 아니면 안되는것인지 잘몰라서 보류           */

GoogleRouter.get('/',
    passport.authenticate('google',{
        scope : ['https://www.googleapis.com/auth/plus.login','email']
    })
)

GoogleRouter.get('/google/callback', //누가 이 url로 접촉을 시도하면
        passport.authenticate('google', { //passport가 로그인을 시도하고
            failureRedirect : '/login' //실패하면 다시 로그인으로 redirect 
        }),
        (req,res)=> { //성공할경우 
            res.send("구글로 로그인 성공!");
    });

KakaoRouter.get('/',(req,res)=> {
    res.send("execute /auth/Kakao");
})


module.exports = {
    google : GoogleRouter,
    kakao : KakaoRouter,
}