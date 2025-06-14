import fs from 'fs'
import path from 'path'
import { GraphQLServer } from 'graphql-yoga'
import Query from './resolvers/query'
import Mutation from './resolvers/mutation'
import dotenv from 'dotenv'
dotenv.config()
import UserDB from './models/UserDB'
import AdminDB from './models/AdminDB'
import UserThirdServices from './models/UserThirdServices'
import Products from './models/Product'
import Cloudinary from 'cloudinary'
import Telegram from 'telegraf/telegram'
import cors from 'cors'

const telegram = new Telegram(process.env.TOKEN_TELEGRAM)
Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const resolvers = { Query, Mutation }
const context = {
  Products,
  UserDB,
  AdminDB,
  UserThirdServices,
  Cloudinary,
  telegram,
}

const typeDefs = fs.readFileSync(
  path.join(process.cwd(), 'dist/schema.graphql'),
  'utf-8'
)
const server = new GraphQLServer({
  // typeDefs: './dist/schema.graphql',
  typeDefs,
  resolvers,
  context: (request) => {
    return { ...request, ...context }
  },
})

const corsOptions = {
  origin: ['https://mi-tienda-online.vercel.app', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  playground: '/gql',
}

// const opts = {
//   cors: {
//     origin: ['https://mi-tienda-online.vercel.app', 'http://localhost:3000'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   },
//   port: process.env.PORT,
//   playground: '/gql',
// }

server.express.use(cors(corsOptions))

import './db'
// server.start(opts, ({ port }) => console.log(`http://localhost:${port}`))
export default server.express
