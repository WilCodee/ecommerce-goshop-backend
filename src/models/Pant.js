import { Schema, model, models } from 'mongoose'

const pantsSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    imgs: [],
    size: [],
  },
  { versionKey: false }
)

export default models.Pant || model('Pant', pantsSchema)
