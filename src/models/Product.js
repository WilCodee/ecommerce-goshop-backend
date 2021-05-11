import { Schema, model, models } from 'mongoose'

const productSchema = new Schema(
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
      type: String,
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
    typeProduct: {
      type: String,
      required: true,
    },
    size: [],
    imgs: [],
  },
  { versionKey: false }
)

export default models.Product || model('Product', productSchema)
