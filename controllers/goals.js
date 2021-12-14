const express = require('express');
const goalsRouter = express.Router();
const Goal = require('../models/goal');

goalsRouter.get('/goals',  (req, res) => {
    Goal.find({}, (err, goals) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(goals);
    });
})

module.exports = goalsRouter;
