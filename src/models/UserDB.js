import { Schema, model, models } from 'mongoose'

const userSchema = new Schema(
  {
    name: String,
    nickName: String,
    age: Number,
    phoneNumber: Number,
    address: String,
    email: String,
    card: {
      cardNumber: { type: Number },
      CVC: { type: Number },
      date: { type: Number },
    },
    gender: String,
    country: String,
    shopping: [],
  },
  { versionKey: false }
)

export default models.UserDB || model('UserDB', userSchema)
