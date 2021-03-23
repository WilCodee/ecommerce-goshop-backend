import mongoose from 'mongoose'

import dotenv from 'dotenv'
dotenv.config()

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    console.log('db is connected successfull')
  } catch (err) {
    console.log('ha ocurrido un error', err)
  }
}

export default connection()
