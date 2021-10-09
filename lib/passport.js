const shortId = require('../config').shortId;
const low = require('../config').lowdb;

module.exports = function (app) {

    var passport = require('passport');
    var LocalStrategy = require("passport-local").Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    const authData = {
        username : 'rlaqudrhks6@gmail.com',
        password : '1234'
    }


    //passport는 내부에서 session을 사용하기 때문에
    //반드시 session아래에 위치해야한다.
    app.use(passport.initialize());
    app.use(passport.session());

    //serializeUser에 register,google,로그인 등 많은 방법으로 로그인할수 있기때문에 각각의 방법에 따라 특정 정보는 undefined가 되기에
    //if(user.password == undefined)와같은 조건문으로 각방법을 분리 시키는게 좋을듯? 보인다    
    passport.serializeUser((user, done) => {
        console.log('serializeUser', user); 
        
        var serializeuse = {
            username : user.name,
            password : user.pwd,
            id : shortId.generate()
        }        
        //console.log('임의로 만든 객체', serializeuse); //확인용
        done(null, user); //여기서 user값 즉 authData값이 session파일에 추가데이터로 저장됨 
        //또한 serializeuse값이 식별자 값이 된다. 즉 deserialize될때마다 serializeuse값을 통해 검사를 한다는 뜻인듯하다
    })

    //페이지에 방문할때마다 밑 함수가 실행되면서 사용자 인가해줌
    //그럴때마다 db에서 사용자의 데이터를 조회해서 가져온다.
    //또한 deserializeUser가 req.user를 만들어준다.
    passport.deserializeUser(function (val, done) {
        console.log('deserializeUser', val);

        var compareVal = low.get('users').find({id : val});
        //이런식으로 db에 있는 id값과 현재 id값을 비교해서 인가하는 방식으로 진행한다
        //mysql로 사용할 경우 mysql db안에 있는 값과 비교해야한다.
        //위부분을 잘 모르겠으면 생활코딩 MultiUserAuth 로그인구현 참고
        //console.log('compareVal',compareVal);


        //이 아래 val값이 req.user값으로 복원된다.
        done(null, val);//authData가 원래는 id값을 가지고 db에 있는 사용자의 정보를 가져오는것
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
            //이부분도 접속한 user의 데이터를 전달해야하는 부분이다 
            //잘 모르겠으면 생활코딩 MultiUserAuth 로그인구현 참고 3:11초
            //username,password의 값과 일치하는 db값이 있는지 검색하고 있다면
            //해당 유저의 정보를 불러와서 그 정보를 return done(null,user)와 같이
            //작성해야한다.,
            console.log('Localstrategy', username, password);      
            //이부분도 bcrypt해서 바꿔야한다
            //생코 Multi User Auth 비밀번호 암호화 13:30참조
            if (username === authData.username) {
                console.log("passport section1")
                if (password === authData.password) {
                    console.log("Success to Login");
                    console.log("passport section2")
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

    const googleCredential = require('../config').googleCredentials;//config파일에 google로 부터 받은 정보를 저장해두고 불러왔다.
    /*console.log('구글 크레덴셜 : ',googleCredential);*/

    //구글로 로 그인 전략을 한다는 의미이고 구글로 로그인하는데 필요한 데이터를 미리 저장한 파일에서 값을 불러와 넣어준다.
    passport.use(new GoogleStrategy({ //각각에 용도에 맞게 불러온 파일의 데이터를 넣어준다.
        clientID : googleCredential.client_id,
        clientSecret : googleCredential.client_secret,
        callbackURL : googleCredential.redirect_uris[0] //얘는 배열로 값을 넣어야 하기에 [0]을 붙여준다.
    },
    function(accessToken,refreshToken,profile,done) { //이 함수는 구글 로그인을 성공했을시 실행 되며 accessToken 과 사용자의 정보가 담긴 profile, refreshToken,done등을 담는다.
        console.log('GoogleStrategy',accessToken,refreshToken,profile);
        console.log('이메일',profile.emails[0].value);
        //이부분에서 db에서 값을 가져와서 현재 로그인된 유저인지 아닌지 검사할수 있다. 예를들어 
        //현재 로그인된 정보가 담긴 token파일이나 lowdb같은 장소에서 로그인된 아이디중 profile.emails[0].value의 값을 가진 아이디가 있는지 확인하고 있다면 
        //구글로 로그인중에 있다. 와같은 필드의 값을 true로 바꾸거나 특정 값을 삽입하는 식으로 하면됨
        //이렇게 함으로써 현재 로그인중인 유저의 값을 추가할 필요없이 기존값을 수정하는등 활용가능
        
        //또한 만약 로그인중이 아닐경우 새롭게 로그인되었다를 표시하거나 정보를 등록할수 있다. 

        var user = { //임의로 생성한 객체로 google로그인 성공시 profile에 담겨져온 user정보중 일부를 담아서 객체를 생성하고 done(null,user)를 통해 데이터 전송
            name : profile.displayName,
            email : profile.emails[0].value,
            locale : profile._json.locale
        }        
        done(null,user); //이값은 serializeUser로 간다.


        //아래 주석된 값은 DB를 이용할때 사용되는 코드라고 한다.
        // User.findOrCreate({googleId : profile.id},function(err,user) {
        //     return done(err,user);
        // });
    }
    ));

    app.get('/auth/google', //사용자가 구글로 로그인을 눌렀을때 인증을 할수 있도록 만들어주는 passport의 코드
        passport.authenticate('google',{
            scope : ['https://www.googleapis.com/auth/plus.login','email'] //이 스코프는 구글에 사용을 할수있도록 요청하는 기능들이다. 우리는 로그인만 넣었다
    }));

    app.get('/auth/google/callback', //누가 이 url로 접촉을 시도하면
        passport.authenticate('google', { //passport가 로그인을 시도하고
            failureRedirect : '/login' //실패하면 다시 로그인으로 redirect 
        }),
        (req,res)=> { //성공할경우 
            res.redirect('/'); // '/'로 redirect시킨다.
    });

    return passport;
}