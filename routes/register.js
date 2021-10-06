const express = require('express');
const router = express.Router();



var user = [];

router.get('/',(req,res)=> {
    res.sendFile('C:/Users/김병관/Desktop/capstone_practice/register.html');
})

router.post('/',(req,res) => {
    try
    {
        user.push({
            id : req.body.name,
            pw : req.body.password,
            email : req.body.email
        })
        res.redirect('/login');
        console.log("정상 작동");
    }
    catch
    {
        res.redirect('/register');
        console.log("오류");
    }
    console.log(user);
})

module.exports = router;