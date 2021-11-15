module.exports = function (app) {
    var passport = require('passport');
    var LocalStrategy = require("passport-local").Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        KakaoStrategy = require('passport-kakao').Strategy;
    const mysql_ = require('./config')._mysql;
    require('dotenv').config();


    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        //console.log('serializeUser', user);
        console.log("part 2");
        console.log('serializeUser : ',user);
        console.log('user.id : ',user.id);
        console.log('user.pw : ',user.pw);

        mysql_.getConnection((err,conn)=> {
            conn.query('select * from users where id = ?',[user.id],(err,result)=> {
                if(err) {
                    console.log('execute err1');                    
                    return done(err);
                }
                if(!result[0]) { //얘는 결과가 없다는 소리
                    conn.query(`insert into users values (?,?)`,[user.id,user.pw],(err,result2)=> {
                        if(err) {
                            console.log('execute err1-1');
                            console.log(err);
                            console.log('!result[0] in data user.id : ',user.id);
                            return done(err);
                        }
                        return done(null,user);
                    })
                }
                conn.release();
                console.log('db res : ',result);
                done(null, user);
            })
        })

        
    })

    passport.deserializeUser(function (user, done) {
        mysql_.getConnection((err, conn) => {
            //여기에 카카오 또는 구글로 로그인을해서 가져온 데이터와 db에 저장된 데이터가 있는지
            //비교해서 있으면 허가아니면 불허가 방식으로 진행해야함
            //그리고 처음 로그인했을때 해당값을 users테이블에 저장하는 방법도 생각해보자
            console.log("part 3");
            conn.query('select * from users where id = ? ', [user.id], (err, result) => {
                if (err) {
                    console.log(err);                    
                    return done(err);
                }
                if (!result[0]) {
                    console.log('there is no id in db');
                    return done(err);
                }
                console.log('deserializeUser');
                done(null, result[0]);
            })
        })
    })

    passport.use(new LocalStrategy(
        {
            usernameField: 'id',
            passwordField: 'pw'
        },
        function (username, password, done) {
            console.log('Localstrategy', username, password);

            mysql_.getConnection((err, conn) => {
                conn.query(`select * from users where id = ? and password = ?`, [username, password], (err, result) => {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (!result[0]) {
                        console.log('there is no id in db');
                        return done(err);
                    }
                    var data = {
                        id: result[0].id,
                        pw: result[0].password,
                        on: true
                    }
                    console.log('result : ', result);
                    console.log('data : ', data);
                    conn.release();
                    done(null, data);
                })
            })

        }
    ));

    //아래가 Google로그인
    passport.use(new GoogleStrategy({
        clientID: process.env.GoogleAuth_ClientID,
        clientSecret: process.env.GoogleAuth_SecretKey,
        callbackURL: process.env.GoogleAuth_callbackURL,
    },
        function (accessToken, refreshToken, profile, done) {
            //console.log('GoogleStrategy', accessToken, refreshToken, profile);
            //console.log('이메일', profile.emails[0].value);


            /*이부분은 조율을 해야한다 기존에 local 방법의 passport경우 id와 pw만으로 로그인했지만
            google이나 kakao로 로그인을 한경우 닉네임, 이메일 같이 한정된 정보만 받을 수 있기에
            아이디나 비밀번호를 이메일 또는 이름으로 하거나 아니면 local전략의 저장되는 정보를 수정하는 방법도있다.
            */

            var user = {
                id: profile.displayName,
                pw: profile.emails[0].value,
                locale: profile._json.locale
            }
            console.log(user);
            console.log("part 1");

            done(null, user); //이값은 serializeUser로 간다. 

        }
    ));

    //아래가 kakao로그인
    passport.use('kakao-login',new KakaoStrategy({        
        clientID : process.env.KakaoAuth_ClientID,
        callbackURL : process.env.KakaoAuth_callbackURL
    },async(accessToken,refreshToken,profile,done)=> {
        console.log('kakaoStrategy');
        console.log(profile);
        var user = {
            id : profile.displayName,
            pw : profile._json.kakao_account.email,
        }
        console.log('kakao user data : ',user);
        done(null,user);
    }
    ))

    return passport;
}