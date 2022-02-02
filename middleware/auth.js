const jsonWebToken = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    const decodedToken = jsonWebToken.verify(token, 'Random_Token_Secret')
    const userId = decodedToken.userId
    if (!userId) {
      res.status(403).send({message: 'You are not authorized'})
    } else {
      next()
      }
    } catch (error) {
      res.status(401).send({error: toString()
      })
    }
  }