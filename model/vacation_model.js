const mongoose = require('mongoose')
const fs = require('fs')
const mongoosePaginate = require('mongoose-paginate-v2')
const {STATUS_AVAILABLE, STATUS_UNAVAILABLE} = require("../helper/constants");

const {Schema} = mongoose

const customLabels = {
  totalDocs: 'total',
  docs: 'vacation'
}

mongoosePaginate.paginate.options = {
  customLabels
}

const VacationSchema = new Schema({
  type: {type: String, required: true},
  title: {type: String, required: true},
  location: {
    planet: {
      type: String,
      required: true},
    region: {
      type: String,
      required: false},
    sector: {
      type: String,
      required: false}
  },
  pointsOfInterest: {
    architecture: {
      type: [String],
      required: false
    },
    nature: {
      type: [String],
      required: false}
  },
  imageFile: {
    type: [String],
    data: Buffer,
    required: false
  },
  description: {type: String, required: false},
  climate: {type: String, required: false},
  price: {type: Number, required: true},
  status: {
    type:Number,
    enum: [STATUS_AVAILABLE, STATUS_UNAVAILABLE],
    default: STATUS_AVAILABLE
  },
  vacationId: { type: mongoose.Types.ObjectId, required: false }
})

VacationSchema.plugin(mongoosePaginate)
const vacationModel = mongoose.model('vacation', VacationSchema)
module.exports = vacationModel

