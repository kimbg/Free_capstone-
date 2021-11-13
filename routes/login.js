const express = require('express');
const router = express.Router();
const mysql_ = require('../config')._mysql;
const passport = require('../passport')(router);


//로그인 페이지 전송, 이미 로그인이 되어있을 땐 / 으로 보냄
router.get('/', (req, res)=> {   
    res.sendFile('/login.html',{root : `Front/html`});
})

//로그인 요청 처리
router.post('/',
    passport.authenticate('local', {
        failureRedirect : '/login'
    }),
    (req,res)=> {
        req.session.save(()=> {
            console.log("local passport success!");
            res.redirect('/');
        })
    }
)
module.exports = router;