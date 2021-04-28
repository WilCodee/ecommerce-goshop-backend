import { GraphQLServer } from 'graphql-yoga'
import Query from './resolvers/query'
import Mutation from './resolvers/mutation'
import dotenv from 'dotenv'
dotenv.config()
import UserDB from './models/UserDB'
import AdminDB from './models/AdminDB'
import UserThirdServices from './models/UserThirdServices'
import Products from './models/Product'
import { Stripe } from 'stripe'
import Cloudinary from 'cloudinary'

Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const stripe = new Stripe(process.env.STRIPE)
const resolvers = { Query, Mutation }
const context = {
  Products,
  stripe,
  UserDB,
  AdminDB,
  UserThirdServices,
  Cloudinary,
}

const server = new GraphQLServer({
  typeDefs: './dist/schema.graphql',
  resolvers,
  context: request => {
    return { ...request, ...context }
  },
})

const opts = {
  port: process.env.PORT,
  playground: '/gql',
}

import './db'
server.start(opts, ({ port }) => console.log(`http://localhost:${port}`))
