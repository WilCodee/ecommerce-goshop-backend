import { GraphQLServer } from 'graphql-yoga'
import Query from './resolvers/query'
import Mutation from './resolvers/mutation'
import dotenv from 'dotenv'
dotenv.config()
import Shoe from './models/Shoe'
import Tshirt from './models/Tshirt'
import Pant from './models/Pant'
import Hat from './models/Hat'
import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE)

const resolvers = { Query, Mutation }
const context = { Shoe, Tshirt, Pant, Hat, stripe }

const server = new GraphQLServer({
  typeDefs: './dist/schema.graphql',
  resolvers,
  context: req => {
    return { ...req, ...context }
  },
})

const opts = {
  port: process.env.PORT,
}

import './db'
server.start(opts, ({ port }) =>
  console.log(`server is running on port ${port}`)
)
