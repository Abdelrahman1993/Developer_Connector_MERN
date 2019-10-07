const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const secretOrKey = require('../../config/keys').secretOrKey;
const jwt = require('jsonwebtoken');
const passport = require('passport');

//@route /api/users/test
//@desc test user route
//@access public
router.get("/test", (req, res) => res.send("users router"));

//@route /api/users/register
//@desc register user data
//@access public
router.post(
    "/register",
    bodyParser.urlencoded({
        extended: false
    }),
    (req, res) => {
        const {
            name,
            email,
            password
        } = req.body;

        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    res.status(400).send({
                        msg: "Email already exist"
                    });
                } else {
                    const avatar = gravatar.url(email, {
                        s: "200",
                        r: "pg",
                        d: "mm"
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, password) => {
                            const newUser = new User({
                                name,
                                email,
                                password,
                                avatar
                            });
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user);
                                })
                                .catch(err => {
                                    res.send(err);
                                });
                        });
                    });
                }
            })
            .catch(); //@route /api/users/register
        //@desc register user data
        //@access public
    }
);

//@route /api/users/login
//@desc user login email pass and return token
//@access public
router.post(
    "/login",
    bodyParser.urlencoded({
        extended: false
    }),
    (req, res) => {
        const {
            email,
            password
        } = req.body;
        User.findOne({
            email
        }).then(user => {
            if (!user) {
                res.status(404).json({
                    msg: "email not found"
                });
            } else {
                bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        res.status(400).json({
                            msg: "password incorrect"
                        });
                    } else {
                        //user Match
                        const payload = {
                            id: user.id,
                            email: user.email
                        }

                        jwt.sign(payload, secretOrKey, {
                            expiresIn: 3600
                        }, (err, token) => {
                            res.json({
                                token: "Bearer " + token
                            })
                        })

                    }
                });
            }
        });
    }
);


// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
    '/current',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
);


module.exports = router;