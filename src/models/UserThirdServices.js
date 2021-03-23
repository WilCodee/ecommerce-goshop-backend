import { Schema, model, models } from 'mongoose'

const userThirdServicesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
    },
    phoneNumber: {
      type: Number,
    },
    img: {
      type: String,
      required: true,
    },
    sendEmail: {
      type: Boolean,
    },
    // address: {
    country: { type: String },
    city: { type: String },
    district: { type: String },
    addressHome: { type: String },
    reference: { type: String },
    // },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    shopping: [],
  },
  { versionKey: false }
)

export default models.UserThirdServicesDB ||
  model('UserThirdServicesDB', userThirdServicesSchema)
