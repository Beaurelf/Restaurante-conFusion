const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const http = require('http')
const session  = require('express-session')
var passport = require('passport');
var config = require('./config');

const url = config.mongoUrl;

const app = express()

const dishRouter = require('./routes/dishRouter')
const promotionRouter = require('./routes/promotionRouter')
const leaderRouter = require('./routes/leaderRouter')
const userRouter = require('./routes/userRouter')

//app.use(cookieParser('12345-67890-09876-54321'))
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false
}))

app.use(passport.initialize());
//app.use(passport.session());

app.use(logger('dev'))

mongoose.connect(url)
.then(()=>{
  console.log('Successful connection')
}).catch(err => console.log(err))

app.use('/users',userRouter);


app.use('/dishes',dishRouter)
app.use('/promotions', promotionRouter)
app.use('/leaders',leaderRouter)


var port = 3000 || process.env.PORT
var host = 'localhost' || process.env.HOST

const server = http.createServer(app)
server.listen(port,host)

