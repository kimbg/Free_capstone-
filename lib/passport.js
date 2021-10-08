const shortId = require('../config').shortId;

module.exports = function (app) {

    var passport = require('passport');
    var LocalStrategy = require("passport-local").Strategy;

    const authData = {
        username : 'rlaqudrhks6@gmail.com',
        password : '1234'
    }


    //passport는 내부에서 session을 사용하기 때문에
    //반드시 session아래에 위치해야한다.
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        console.log('serializeUser', user); 
        
        var serializeuse = {
            username : user.name,
            password : user.pwd,
            id : shortId.generate()
        }
        console.log('임의로 만든 객체', serializeuse); 
        done(null, serializeuse); //여기서 user값 즉 authData값이 session파일에 추가데이터로 저장됨
    })

    //페이지에 방문할때마다 밑 함수가 실행되면서 사용자 인가해줌
    //그럴때마다 db에서 사용자의 데이터를 조회해서 가져온다.
    passport.deserializeUser(function (id, done) {
        console.log('deserializeUser', id);
        done(null, authData);//authData가 원래는 id값을 가지고 db에 있는 사용자의 정보를 가져오는것
        //authData는 받는 함수의 req.user에 유저정보가 담겨져서 보내진다
        //passpoart를 사용할경우 req.user가 활성화된다. 
        //req.user는 아래 passport.use에서 done으로 보낸값이고 
        //따라서 req.user가 있다는 것은 로그인에 성공했다는 의미이다.
    })



    passport.use(new LocalStrategy(
        {
            usernameField: 'email'
        },
        
        function (username, password, done) {
            console.log('Localstrategy', username, password);            
            if (username === authData.username) {
                if (password === authData.password) {
                    console.log("Success to Login");
                    return done(null, authData); //여기서 로그인 성공시 authData값이 
                    //passport.serializeUser의 user매개변수에 들어간다.
                }
                else {
                    console.log("Incorret Password");
                    return done(null, false, { message: "Incorret Password" });
                }
            }
            else {
                console.log("Incorret Username");
                return done(null, false, { message: "Incorret Username" });
            }
        }
    ));
    return passport;
}