const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer')
const upload = multer({dest: './images'})


mongoose.connect('mongodb://localhost:27017/star-wars_vacation')
    .then(res => console.log('Connected to MongoDB'))
    .catch(error => console.error(error.reason, error.message))

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

const vacationRouter = require('./routes/vacation_routes')
const userVacationRouter = require('./routes/userVacation_routes')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
//app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/star-wars_vacation', vacationRouter)
app.use('/star-wars_vacation/user_auth', userVacationRouter)

app.use(function(req, res, next) {
  res.status(404).send({message : 'route not found'})
})

app.use(cors())


module.exports = app;