const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Leader = require('../models/leaders')

var authenticate = require('../middleware/auth')

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.all((req,res,next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

leaderRouter.route('/')
.get((req, res, next) =>{
    Leader.find()
    .then(leaders => res.status(200).json(leaders))
    .catch(err => console.log(err))
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) =>{
    var leader = new Leader({
        ...req.body
    })
    leader.save()
    .then(() => res.status(201).json({msg: 'Leader has been registered !'}))
    .catch(err => console.log(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) =>{
    Leader.remove({})
    .then(() => res.status(200).json({msg: 'Leaders have been deleted !'}))
    .catch(err => console.log(err))
})


leaderRouter.route('/:Id')
.get(authenticate.verifyUser,(req, res, next)=>{
    Leader.find({_id: req.params.Id})
    .then(leader => res.status(200).json(leader))
    .catch(err => console.log(err))
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=>{
    Leader.updateOne({_id: req.params.Id}, {...req.body, _id: req.params.Id})
    .then(() => res.status(200).json({msg: 'Successful updated !'}))
    .catch(err => console.log(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=>{
    Leader.deleteOne({_id: req.params.Id})
    .then(() => res.status(200).json({msg: 'Successful deleted !'}))
    .catch(err => console.log(err))
})

module.exports = leaderRouter;