const Subscription = {
  sells: {
    subscribe: (_, __, { pubsub }) => {
      return pubsub.asyncIterator('sells')
    },
  },
}
export default Subscription
