import { Schema, model, models } from 'mongoose'

const pantsSchema = new Schema(
  {
    brand: String,
    model: String,
    description: String,
    price: Number,
    stock: Number,
    gender: String,
    material: String,
    type: String,
    imgs: [],
    size: [],
  },
  { versionKey: false }
)

export default models.Pant || model('Pant', pantsSchema)
