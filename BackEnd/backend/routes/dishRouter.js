const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Dish = require('../models/dishes')

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

var authenticate = require('../middleware/auth');

dishRouter.all((req,res,next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
})

dishRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    Dish.find()
    .then(dishes => res.status(200).json(dishes))
    .catch(err => console.log(err))
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    var dish = new Dish({
        ...req.body
    })
    dish.save()
    .then(()=> res.status(201).json({msg: 'Successful registered !'}))
    .catch(err => console.log(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dish.remove({})
    .then((resp) => res.status(200).json(resp))
    .catch(err => console.log(err))
})



dishRouter.route('/:Id')
.get(authenticate.verifyUser, (req,res,next) => {
    Dish.findOne({_id: req.params.Id})
    .then(dish => res.status(200).json(dish))
    .catch(err => console.log(err))
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dish.updateOne({_id: req.params.Id}, {...req.body, _id:Id})
    .then(dish => res.status(200).json(dish))
    .catch(err => console.log(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dish.deleteOne({_id:req.params.Id})
    .then(()=> res.status(201).json({msg: 'Successful deleted !'}))
    .catch(err => console.log(err))
})


dishRouter.route('/:Id/comments')
.get((req,res,next) => {
    Dish.findOne({_id: req.params.Id})
    .then(dish => res.status(200).json(dish.comments))
    .catch(err => console.log(err))
})
.post(authenticate.verifyUser,(req,res,next) => {
    Dish.findOne({_id: req.params.Id})
    .then(dish => {
        dish.comments.push({...req.body})
        dish.save()
        .then(() => res.status(200).json(dish.comments))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dish.findOne({_id: req.params.Id})
    .then(dish => {
        dish.comments.map(comment => {
            dish.comments.remove(comment)
        })
        dish.save()
        .then(() => res.status(200).json(dish.comments))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})



dishRouter.route('/:dishId/comment/:commentId')
.get((req,res,next) => {
    Dish.findOne({_id: req.params.dishId})
    .then(dish => {
        res.status(200).json(dish.comments.id(req.params.commentId))
    })
    .catch(err => console.log(err))
})
.put(authenticate.verifyUser,(req,res,next) => {
    var userId = req.user._id
    Dish.findOne({_id: req.params.dishId})
    .then(dish => {
        if(dish.comments.id(req.params.commentId).author.equals(userId)){
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then(()=> res.status(201).json(dish.comments))
            .catch(err => console.log(err))
        }
        else{
            res.status(403).json({msg:"You are not authorized to perform this operation!"})
        }
    })
    .catch(err => console.log(err))
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Dish.findOne({_id: req.params.dishId})
    .then(dish => {
        dish.comments.id(req.params.commentId).remove()
        dish.save()
        .then(()=> res.status(201).json(dish.comments))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})



module.exports = dishRouter;