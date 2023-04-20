const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

var authenticate = require('../middleware/auth')

const Promotion = require('../models/promotions')

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());


promotionRouter.all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })

promotionRouter.route('/')
.get(authenticate.verifyUser,(req, res, next) =>{
    Promotion.find()
    .then(promotions => res.status(200).json(promotions))
    .catch(err => console.log(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    console.log(req.body)
    var promotion = new Promotion({
        ...req.body
    })
    promotion.save()
    .then(() => res.status(201).json({msg: 'Promotion has been registered !'}))
    .catch(err => console.log(err))
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Promotion.remove({})
    .then(() => res.status(200).json({msg: 'Promotions have been deleted !'}))
    .catch(err => console.log(err))
})


promotionRouter.route('/:Id')
.get(authenticate.verifyUser, (req, res, next)=>{
    Promotion.find({_id: req.params.Id})
    .then(promotion => res.status(200).json(promotion))
    .catch(err => console.log(err))
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Promotion.updateOne({_id: req.params.Id}, {...req.body, _id: req.params.Id})
    .then(() => res.status(200).json({msg: 'Successful updated !'}))
    .catch(err => console.log(err))
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    Promotion.deleteOne({_id: req.params.Id})
    .then(() => res.status(200).json({msg: 'Successful deleted !'}))
    .catch(err => console.log(err))
})

module.exports = promotionRouter;