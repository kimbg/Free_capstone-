const express = require('express');
const router = express.Router();
const passport = require('../passport')(router);



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
        res.redirect('/main');
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