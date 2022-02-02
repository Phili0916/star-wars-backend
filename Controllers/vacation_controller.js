const vacationModel = require('../model/vacation_model');




/** Post Request for your vacation **/
exports.createPost = async (req, res) => {
  console.log('req.body', req.body)
  try {
    const newVacation = await new vacationModel(req.body).save()
    console.log(newVacation)
    res.status(201).send({
      message: 'Your Vacation Post was Saved Successfully',
      newVacation
    })
  } catch(error) {
    res.status(400).send({
      error: error
    })
  }
}
/**Add Image to Vacation **/
exports.addImageToVacation = async (req, res) => {
  console.log(req.body)

  const addImage = await vacationModel.findOneAndUpdate()
}

/** GET Request Get all vacations **/
exports.getAllVacations = async (req, res) => {
  try {
    const pagination = await vacationModel.paginate({
      sort: {createdAt: -1},
      page: 1,
      limit: 10
    })
    res.status(200).send({
      message: 'You have retrieved all of your Star Wars Vacations',
      ...pagination
    })
  }
  catch(error) {
    res.status(400).send({
      message: 'You have not retrieved all possible Star Wars vacations',
      error: error
    })
  }
}

/** GET Request Get vacations based on ID **/
exports.getVacationById = async (req, res) => {
  try {
    const vacation = await vacationModel.findOne({id: req.params.id})
    if(vacation) {
      res.status(200).send({
        message: 'You have retrieved your Star Wars Vacation',
        vacation: vacation
      })
      return
    }
    res.status(404).send({
      message: 'You have not received your Star Wars Vacation'
    })
  }
  catch (error) {
    res.status(400).send({
      message: 'No Star Wars Vacation',
      error: error
    })
  }
}

/** GET Request Get Vacation based on certain criteria **/
exports.getVacationBy = async (req, res, params) => {
  try {
    for(const [key, value] of Object.entries(params)) {
      console.log('key', key)
      switch(key) {
        case 'vacationId':
          params[key] = value
          break
        case 'type':
          params[key] = value
          break
        case 'title':
          params[key] = {$regex: value, $options: 'i'}
          delete params[key]
          break
        case 'planet':
        case 'region':
        case 'sector':
          params['location.' + key] = {$regex: value, $options: 'i'}
          delete params[key]
          break
        case 'architecture':
        case 'nature':
          params['pointsOfInterest.' + key] = {$regex: value, $options: 'i'}
          delete params[key]
          break
        case 'description':
          params[key] = {$regex: value, $options: 'i'}
          delete params[key]
          break
        case 'imageFile':

        case 'climate':
          params[key] = value
          break
        case 'minPrice':
          if(!params.price) {
              params.price = {"$gt": parseFloat(params.minPrice) }
          }
          else {
            params.price.$gt = parseFloat(params.minPrice)
          }
          delete params.minPrice
          break
        case 'maxPrice':
          if(!params.price) {
            params.price = {"$lt": parseFloat(params.maxPrice) }
          }
          else {
            params.price.$lt = parseFloat(params.maxPrice)
          }
          delete params.maxPrice
          break
        case 'status':
          params.status = {}
          if(value) {
            params.status.$in = value.split(',')
          }
          if(Object.keys(params.status).length === 0) {
            delete params.status
          }
          break
        default:
          break
      }
    }
    const myLimit = params.limit || 10
    console.log('params before request', params)
    const vacation = await vacationModel.paginate(params, {
      sort: { createdAt: -1 },
      page: 1,
      limit: myLimit
        }
        )
    res.status(200).send({
      message: 'Here is your Star Wars Vacation',
      vacation
    })
  }
  catch (error) {
    console.error(error)
    res.status(400).send(error.toString())
  }

}

/** Update One Vacation based on its ID **/

exports.updateVacationById = async(req, res) => {
  try {
    console.log(req)
    for (const[key, value] of Object.entries(req.body)) {
      switch(key) {
        case 'planet':
        case 'region':
        case 'sector':
          req.body['location.' + key] = value
          break
        case 'architecture':
        case 'nature':
          req.body['pointsOfInterest.' + key] = value
          break
      }
    }
    const updateVacation = await vacationModel.findOneAndUpdate({id: req.params.id}, req.body, {new: true})
    res.status(201).send({
      message: 'You have updated your vacation',
      updateVacation
    })
  }
  catch(error) {
    res.status(400).send(error.toString())
  }
}

/** Delete Vacation **/

exports.deleteVacation = async(req, res) => {
  try {
    const deleteVacation = await vacationModel.findOneAndUpdate({id: req.params.id})
    res.status(200).send({
      message: 'You have deleted your vacation',
      vacation: deleteVacation
    })
  }
  catch (error) {
    res.status(400).send({
      message: 'You have not deleted your vacation',
      error
    })
  }
}
