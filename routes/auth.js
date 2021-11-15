const express = require('express');
const router = express.Router();
const passport = require('../passport')(router);

const GoogleRouter = express.Router();
const KakaoRouter = express.Router();

/* 이파일은 일단 보류 /auth관련해서 routes로 passport와 분리하려 시도했지만
    Router의 숙련도 미달인지 아니면 안되는것인지 잘몰라서 보류           */

router.get('/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', 'email']
    })
)

router.get('/google/callback', //누가 이 url로 접촉을 시도하면
    passport.authenticate('google', { //passport가 로그인을 시도하고
        failureRedirect: '/login' //실패하면 다시 로그인으로 redirect 
    }),
    (req, res) => { //성공할경우 
        console.log("part 4");
        req.session.save(() => {
            console.log("구글 로그인 성공!");
            res.redirect('/');
        })
    });

router.get('/kakao', passport.authenticate('kakao-login'));
router.get('/kakao/callback', passport.authenticate('kakao-login', {
    failureRedirect: '/login'
}),
    (req, res) => {
        req.session.save(() => {
            console.log("카카오 로그인 성공!");
            res.redirect('/main');
        })
    }
)

module.exports = router;