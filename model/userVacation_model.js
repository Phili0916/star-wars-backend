const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const {Schema} = mongoose


const UserVacationSchema = new Schema({
firstName : {type: String, Required: true},
lastName : {type: String, Required: true},
email: {type: String, Required: true},
password: {type: String, Required: true}
})

UserVacationSchema.plugin(uniqueValidator)

const userVacationModel = mongoose.model('userVacation', UserVacationSchema)
module.exports = userVacationModel