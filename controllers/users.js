const express = require('express');
const usersRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

usersRouter.get('/users', (req, res) => {
    console.log('hi')
    res.send('hi')
    // User.find({}, (err, users) => {
    //     if (err) return res.status(500).send(err);
    //     return res.status(200).send(users);
    // });
})


usersRouter.post('/', (req, res) => {
    console.log(req.body, 'is req body')
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
    req.body.password = hash;
    User.create(req.body, (error, user) => {
        console.log(user, 'is the user')
        req.session.user = user._id; // this is a login
        res.status(200).send({ user: user._id, birthdate: user.birthdate }); // send the logged in user to a private space in the site
    });
});

usersRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

usersRouter.post('/login', (req, res) => {
    // step 1 - find the user in the database by their email/username
    User.findOne({ username: req.body.username }, '+password', (err, foundUser) => {
        // step 1.1 - if the user is not found, respond with a error saying invalid credentials
        if (!foundUser) return res.status(400).send('Invalid Credentials');
        // step 2 - assuming we've found user, now we compare passwords - plain text - password digest
        if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
            // step 2.1 - if there is not match, respond with a error saying invalid credentials
            return res.status(400).send('Invalid Credentials');
        }
        // step 3 assuming there is a match, we create a session and redirect to dashboard
        req.session.user = foundUser._id
        res.status(200).send({ user: foundUser._id, birthdate: foundUser.birthdate });
    })
});

module.exports = usersRouter;
