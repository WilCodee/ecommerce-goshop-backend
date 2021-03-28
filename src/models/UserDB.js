import { Schema, model, models } from 'mongoose'

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
    },
    nickName: {
      type: String,
    },
    img: {
      type: String,
    },
    age: {
      type: Number,
    },
    phoneNumber: {
      type: String,
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
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
    },
    shopping: [],
    cart: [],
  },
  { versionKey: false }
)

export default models.UserDB || model('UserDB', userSchema)
