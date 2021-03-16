import { Schema, model, models } from 'mongoose'

const hatsSchema = new Schema(
  {
    brand: String,
    model: String,
    description: String,
    price: Number,
    stock: Number,
    gender: String,
    material: String,
    imgs: [],
    size: [],
  },
  { versionKey: false }
)

export default models.Hat || model('Hat', hatsSchema)
