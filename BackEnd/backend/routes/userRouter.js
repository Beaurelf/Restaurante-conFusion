const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport')

const User = require('../models/users');
var authenticate = require('../middleware/auth');
const userRouter = express.Router()

userRouter.use(bodyParser.json());
userRouter.all((req,res,next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

userRouter.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find()
    .then(users => res.status(200).json(users))
    .catch(err => console.log(err))
})
userRouter.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      if (req.body.admin)
        user.admin = req.body.admin;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id, isAdmin: req.user.admin});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

userRouter.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter