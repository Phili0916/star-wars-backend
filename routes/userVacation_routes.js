const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router()
const auth = require('../middleware/auth')
const userVacationCtrl = require('../Controllers/userVacation_controller')

/** User SignUp **/
router.post('/signup',
    userVacationCtrl.signup
)

/** User Login **/

router.post('/login',
    body('email').notEmpty(),
    body('password').notEmpty(),
    (req, res, next) => {
    const errors = validationResult(req)
      if(!errors.isEmpty()) {
        res.status(400).send({errors: errors.array()})
      }
      next()
  },
  userVacationCtrl.login
)

/** Get User Account **/

router.get('/getUser/:id',
    auth,
    async function (req, res, next)  {
    console.log(req.params.id, 'params')
      await userVacationCtrl.getUser(req, res)
  }
)


/** Delete Your Account **/

router.delete('/delete',
    userVacationCtrl.delete
    )

module.exports = router