import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const SECRET_KEY = 'GOSHOPpro'

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
  const emailRegex =
    /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (emailRegex.test(email)) return true
  throw new Error('Correo incorrecto')
}
