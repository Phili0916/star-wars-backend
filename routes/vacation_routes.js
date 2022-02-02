const express = require('express');
const path = require('path')
const {body, validationResult} = require('express-validator');
const router = express.Router()
const vacationCtrl = require('../Controllers/vacation_controller')
const auth = require('../middleware/auth')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../images')
  },
  filename: (req, file, cb) => {
    console.log('file', file)
    cb(null, Date.now() + path.extname(file.fieldname))
  },
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6
  },
  fileFilter: fileFilter
})



/** Post your Vacation **/
router.post('/', upload.single('file'),
    auth,
    body('type').notEmpty(),
    body('type').notEmpty(),
    (req, res, next) => {
    const file = req.file;
     console.log(file)
    const errors = validationResult(req);
    console.log(req.file, 'req.file')
    if(!errors.isEmpty()) {
      return res.status(400).send({errors: errors.array()})
    }
    next()
    },
    vacationCtrl.createPost
)

/** Get all of your Vacations **/
router.get('/',
    vacationCtrl.getAllVacations
    )

/** Get Vacation based on ID **/
router.get('/:id',
    auth,
    body('options').isObject(),
    vacationCtrl.getVacationById
    )

/** Get Vacation by Criterion **/
router.get('/:criterion/',
    auth,
    async function(req, res, next) {
        let params = req.query
      console.log(req.query)
        await vacationCtrl.getVacationBy(req, res, params)
        }
      )

/** PUT Update Vacation by ID **/
router.put('/:id',
    auth,
    (req,res,next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).send({
          errors: errors.array()
        })
      }
        next()
      },
    vacationCtrl.updateVacationById
    )

/** DELETE Delete Vacation **/

router.delete('/:id',
    auth,
    vacationCtrl.deleteVacation
)

module.exports = router