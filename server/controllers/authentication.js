const User = require('../models/user');

module.exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password
    //see if user exists
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
            //respond to request indicating that user is created
            res.json({success: true});
        });
    });





}