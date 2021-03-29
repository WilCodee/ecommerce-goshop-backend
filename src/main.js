import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './resolvers/query'
import Mutation from './resolvers/mutation'
import Subscription from './resolvers/subscription'
import dotenv from 'dotenv'
dotenv.config()
import UserDB from './models/UserDB'
import AdminDB from './models/AdminDB'
import UserThirdServices from './models/UserThirdServices'
import Shoe from './models/Shoe'
import Tshirt from './models/Tshirt'
import Pant from './models/Pant'
import Hat from './models/Hat'
import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE)
const pubsub = new PubSub()
const resolvers = { Query, Mutation, Subscription }
const context = {
  Shoe,
  Tshirt,
  Pant,
  Hat,
  stripe,
  UserDB,
  AdminDB,
  UserThirdServices,
  pubsub,
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
}

import './db'
server.start(opts, ({ port }) => console.log(`http://localhost:${port}`))
