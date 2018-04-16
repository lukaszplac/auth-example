const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
//passport-jwt is strategy for jwt authentication
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


//create local strategy - for signin
const localOptions = {
    usernameField: 'email'
}
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    //verify this username and passwor, call done with user if it is correct
    //password and username, otherwise call done with false
    User.findOne({email: email}, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);

        //compare passwords - is 'password' equal to user.password
        user.comparePassword(password, function(err, isMatch){
            if (err) return done(err);
            if (!isMatch) return done(null, false);
            return done(null, user);
        })
    });

})

//set up options for jwt strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//create JWT strategy - for signup 
//payload - decoded jwt token
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    //see if the user id in the payload exists in our database
    //id it does , call done with that user,
    //otherwise, call done without a user object
    User.findById(payload.sub, function(err, user) {
        if (err) {return done(err, false)}
        if (user) {
            done(null, user)
        } else {
            done(null, false);
        }
    })
})

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);