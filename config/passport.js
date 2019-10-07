const passportjwt = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const secretOrKey = require('../config/keys').secretOrKey;

const opts = {
    jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretOrKey
};

module.exports = passport => {
    passport.use(
        new passportjwt.Strategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};