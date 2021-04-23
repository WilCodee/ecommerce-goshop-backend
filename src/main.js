import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './resolvers/query'
import Mutation from './resolvers/mutation'
import Subscription from './resolvers/subscription'
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import UserDB from './models/UserDB'
import AdminDB from './models/AdminDB'
import UserThirdServices from './models/UserThirdServices'
import Products from './models/Product'
import { Stripe } from 'stripe'
import Cloudinary from 'cloudinary'

Cloudinary.config({
  cloud_name: 'dphhkpiyp',
  api_key: '749396252758529',
  api_secret: 'zD4V9JO-PCvE0kXijRkxOMADq9M',
})

const stripe = new Stripe(process.env.STRIPE)
const pubsub = new PubSub()
const resolvers = { Query, Mutation, Subscription }
const context = {
  Products,
  stripe,
  UserDB,
  AdminDB,
  UserThirdServices,
  pubsub,
  Cloudinary,
}

const server = new GraphQLServer({
  typeDefs: './dist/schema.graphql',
  resolvers,
  context: request => {
    return { ...request, ...context }
  },
})

server.express.use(express.static(path.join(__dirname, 'public/images')))

const opts = {
  uploads: {
    maxFileSize: Infinity,
    maxFiles: Infinity,
    maxFieldSize: Infinity,
  },
  port: process.env.PORT,
  subscriptions: '/subs',
  playground: '/gql',
}

import './db'
server.start(opts, ({ port }) => console.log(`http://localhost:${port}`))
