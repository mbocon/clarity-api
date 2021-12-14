// require deps
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require('cors')
const session = require('express-session');
const usersController = require('./controllers/users');
const goalsController = require('./controllers/goals');
// initialize app
const app = express();

// configure settings
require('dotenv').config();

const { DATABASE_URL, PORT, SECRET } = process.env;

// connect to and configure mongoDB with mongoose

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

// set up mongodb event listeners
db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.log('MongoDB Error: ' + err.message));


// mount middleware
app.use(express.urlencoded({ extended: false })); // creates req.body
app.use(express.json()); // creates req.body
app.use(cors());

app.use(methodOverride('_method'));
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(async function(req, res, next) {
    if(req.session && req.session.user) {
        const user = await require('./models/user').findById(req.session.user)
        res.locals.user = user;
        console.log('user', user)
    } else {
        res.locals.user = null;
        console.log('over here')
    }
    next();
});

// mount routes
app.use('/users', usersController);
app.use('/goals', goalsController);

// tell the app to listen
// heroku or any cloud service will set this value for us

app.listen(PORT, () => {
    console.log('Express is listening on port: ' + PORT);
});
