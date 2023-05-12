const express = require('express');
const bodyParser = require('body-parser');

const Favorite = require('../models/favorite')
const Dish = require('../models/dishes')

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

var authenticate = require('../middleware/auth');

favoriteRouter.all((req,res,next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
})

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    Favorite.findOne({user: req.user._id}).populate(['user', 'dishes'])
    .then(favorite => res.status(200).json(favorite))
    .catch(err => console.log(err))
})

.post(authenticate.verifyUser,(req,res,next) => {
    req.body.map(f => {
        Favorite.findOne({user: req.user._id})
        .then(favorite => {
            if(favorite){
                Dish.findOne({_id: f._id})
                .then(dish => {
                    if(dish){
                        if(favorite.dishes.indexOf(dish._id) == -1){
                            favorite.dishes.push(dish)
                            favorite.save()
                            .then(()=> res.status(201).json(favorite))
                            .catch(err => console.log(err))
                        }else{
                            res.status(201).json({msg:'This dish is already in yours favourite dishes'})
                        }
                    }
                })
                .catch(err => console.log(err))
            }else{
                var favorite = new Favorite({
                    user: req.user._id
                })
                Dish.findOne({_id: f._id})
                .then(dish => {
                    favorite.dishes.push(dish)
                    favorite.save()
                    .then(()=> res.status(201).json(favorite))
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
            }
        })
    })
})

.delete(authenticate.verifyUser,(req,res,next) => {
    Favorite.deleteOne({user: req.user._id})
    .then(() => res.status(200).json({msg:'Succesful deleted!'}))
    .catch(err => console.log(err))
})



favoriteRouter.route('/:Id')
.post(authenticate.verifyUser,(req,res,next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
            Dish.findOne({_id: req.params.Id})
            .then(dish => {
                if(dish){
                    if(favorite.dishes.indexOf(dish._id) == -1){
                        favorite.dishes.push(dish)
                        favorite.save()
                        .then(()=> res.status(201).json(favorite))
                        .catch(err => console.log(err))
                    }else{
                        res.status(201).json({msg:'This dish is already in yours favourite dishes'})
                    }
                }
            })
            .catch(err => console.log(err))
        }else{
            var favorite = new Favorite({
                user: req.user._id
            })
            Dish.findOne({_id: req.params.Id})
            .then(dish => {
                favorite.dishes.push(dish)
                favorite.save()
                .then(()=> res.status(201).json(favorite))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
    })
    .catch(err => console.log(err))
})

.delete(authenticate.verifyUser,(req,res,next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
            favorite.dishes.map(dish => {
                if(dish.equals(req.params.Id)){
                    favorite.dishes.remove(dish)
                }
            })
            favorite.save()
                .then(()=> res.status(201).json(favorite))
                .catch(err => console.log(err))
        }else{
            res.status(400).json({msg:'This user has no favourite dishs'})
        }
    })
    .catch(err => console.log(err))
})

module.exports = favoriteRouter
