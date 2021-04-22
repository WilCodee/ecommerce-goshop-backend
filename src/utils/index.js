import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import verify from 'email-verifier-node'
import WhatsAppWeb from 'baileys'
const client = new WhatsAppWeb()

const SECRET_KEY = 'GOSHOPpro'
const phone = process.env.ADMIN_PHONE_NUMBER_WHATSAPP

export const getUser = request => {
  const header = request.get('authorization')
  if (header) {
    const token = header.replace('Bearer ', '')

    const { userId } = jwt.verify(token, SECRET_KEY)
    return userId
  }
  throw new Error('Authorization required')
}

export const genToken = userId => {
  return jwt.sign({ userId }, SECRET_KEY)
}

export const hastPassword = password => {
  if (password.length < 6)
    throw new Error('Password must be 6 characters or longer')
  return bcrypt.hashSync(password, 10)
}

export const comparePassword = (reqPass, dbPass) => {
  try {
    return bcrypt.compareSync(reqPass, dbPass)
  } catch {
    throw new Error('Invalid password')
  }
}

export const validateEmail = async email => {
  const emailRegex = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (emailRegex.test(email)) {
    const emailGood = await verify.verify_email(email)
    if (emailGood.errors) throw new Error('Este correo no existe')
    return true
  }
  throw new Error('Correo incorrecto')
}

export const connectWa = async () => {
  try {
    await client.connect()
    return true
  } catch (error) {
    console.log(error)
    throw new Error('fail to send message', error)
  }
}

export const sendMsgWa = msg => {
  try {
    const opt = {
      quoted: null,
      timestamp: new Date(),
    }

    client.sendTextMessage(`${phone}@s.whatsapp.net`, msg, opt)
    return true
  } catch (error) {
    throw new Error('fail to send message')
  }
}
