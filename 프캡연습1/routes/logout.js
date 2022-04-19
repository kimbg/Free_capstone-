const express = require('express');
const router = express.Router();



router.post('/',(req,res) => {
    res.sendFile('C:/Users/김병관/Desktop/capstone_practice/login.html');
    res.cookie('user_id',"",{maxAge : 0});
    res.cookie('user_pw',"",{maxAge : 0});
})

module.exports = router;