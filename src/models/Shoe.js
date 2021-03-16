import { model, Schema, models } from 'mongoose'

const shoeSchema = new Schema(
  {
    brand: String,
    model: String,
    description: String,
    price: Number,
    stock: Number,
    gender: String,
    type: String, // #zapatilas zapato
    material: String,
    imgs: [],
    size: [],
  },
  { versionKey: false }
)

export default models.Shoe || model('Shoe', shoeSchema)
