import { model, Schema, models } from 'mongoose'

const shoeSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    model: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    stock: {
      type: Number,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    material: {
      type: String,
      require: true,
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

export default models.Shoe || model('Shoe', shoeSchema)
