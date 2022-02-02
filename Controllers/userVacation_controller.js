const bcrypt = require('bcrypt')
const jsonWebToken = require('jsonwebtoken')
const userVacationModel = require('../model/userVacation_model')

const {PASSWORD_SALT} = require('../helper/constants')

exports.signup = async (req, res) => {
  console.log(req, 'req')
  try {
    const encryptedPassword = await bcrypt.hash(req.body.password, PASSWORD_SALT)
    const newUser = await userVacationModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: encryptedPassword
    })
    res.status(201).send({
      message: 'User has been saved',
      newUser
    })
  }
  catch (error) {
    res.status(500).send({
      error: error.toString()
    })
  }
}

/** User Login **/
exports.login = async function(req, res) {
  console.log(req, 'req login')
  try {
    const user = await userVacationModel.findOne({email: req.body.email})
    if(!user) {
      res.status(404).send({
        message: "User not Found"})
      return
    }
    const isGoodPassword = await bcrypt.compare(req.body.password, user.password)
    if(!isGoodPassword) {
      res.status(403).send({
        message: "Password is not Correct"})
      return
    }
    const token = jsonWebToken.sign(
        {userId: user._id},
        'Random_Token_Secret',
        {expiresIn: '24h'})
    res.status(200).send({
      userId: user._id,
      token: token
    })
  }
  catch(error) {
    res.status(500).send({
      error: error.toString()
    })
  }
}

/** Get User Account **/

exports.getUser = async (req, res) => {
  let params = req.query.id
  console.log(params, 'params')
  console.log(req.params.id, req.params.id, 'okkk')
  try {
    const user = await userVacationModel.findById({_id: req.params.id || ''})
    console.log(user, 'user')
    console.log('user Id', user.id)
    if(!user) {
      res.status(404).send({
        message: "User is not Found"
      })
      return
    }
    user.password = ''
    res.status(200).send({
      message: 'User has been Found',
      user: user
    })
  }
  catch(error) {
    res.status(400).send({
      message: 'User Not Found',
      error: error.toString()
    })
  }
}



/** Delete User Account **/

exports.delete = async function(req, res) {
  try {
    const deleteUser = await userVacationModel.deleteOne({_id: req.params.id})
    const userHasBeenDeleted = await res.status(200).send({
      message: 'Your Account Has Been Deleted',
      deleteUser
    })
    return userHasBeenDeleted
  }
  catch(error) {
    res.status(400).send({
      message: 'Your Account Has not Been Deleted',
      error
    })
  }
}