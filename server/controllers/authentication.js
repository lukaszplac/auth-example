const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    //iat: issued at time -convention
    //sub: who belongs this token to - convention
    return jwt.encode({sub: user.id, iat: timeStamp}, config.secret);
}

exports.signin = function(req, res, next) {
    //user has already had their email and password authenticated
    //we just need to give them a token
    //we take user from passport. 'done' callback assings user to req.user
    res.send({token: tokenForUser(req.user)});
}

module.exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password
    //see if user exists
    if (!email || !password) {
        return res.status(422).send("You must provide an email and password");
    }
    User.findOne({email: email}, function(err, existingUser) {
        //if user exists return an error
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.status(422).send({error: "Email is in use"}); //422 - unprocessable entity
        }
        //if a user does not exist create and save record
        const user = new User({
            email: email,
            password: password
        });
        user.save(function(err) {
            if (err) return next(err);
            //respond to request by return a token
            res.json({token: tokenForUser(user)});
        });
    });
}