const express = require('express');
const router = express.Router();
const mysql_ = require('../config')._mysql;

router.post('/', (req, res) => {
    mysql_.getConnection((err,conn)=> {
        conn.query(`insert into users values (?,?)`,[req.body.id,req.body.pw],(err,result)=> {
            if(err){
                //primary key를 통해 중복된 아이디나 다른 db문제로 로그인이 안될경우
                //아래와 같이 다시 register를 redirect하게하고 ajax를 통해 알림을 생성하면 될듯하다.
                console.log(err);                
                return res.redirect('/login');
            }
            console.log(result);
            conn.release();
            res.redirect('/');
        })
    })  
})

module.exports = router;