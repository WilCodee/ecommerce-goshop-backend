import { Schema, model, models } from 'mongoose'

const adminSchema = new Schema(
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
    admin: {
      type: Boolean,
      required: true,
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
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    sales: [],
  },
  { versionKey: false }
)

export default models.AdminDB || model('AdminDB', adminSchema)
