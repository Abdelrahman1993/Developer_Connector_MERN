const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const User = require('../../models/User')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//@route /api/users/test
//@desc test user route
//@access public
router.get('/test', (req, res) => res.send('users router'))

//@route /api/users/register
//@desc register user data
//@access public
router.post('/register', bodyParser.urlencoded({
    extended: false
}), (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    User.findOne({
        email: email
    }).then((user) => {
        if (user) {
            res.status(400).send({
                msg: 'Email already exist'
            })
        } else {
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, password) => {
                    const newUser = new User({
                        name,
                        email,
                        password,
                        avatar
                    })
                    newUser.save().then((user) => {
                        res.json(user);
                    }).catch((err) => {
                        res.send(err);
                    })
                })
            })
        }
    }).catch();
})
module.exports = router;