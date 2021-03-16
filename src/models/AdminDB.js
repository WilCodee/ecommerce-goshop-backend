import { Schema, model, models } from 'mongoose'

const adminSchema = new Schema(
  {
    name: String,
    nickName: String,
    admin: Boolean,
    age: Number,
    phoneNumber: Number,
    email: String,
    password: String,
    gender: String,
    country: String,
    sales: [],
  },
  { versionKey: false }
)

export default models.AdminDB || model('AdminDB', adminSchema)
