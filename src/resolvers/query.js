const Query = {
  shoes: async (_, { _id, limit }, { Shoe }) => {
    if (_id) return await Shoe.find({ _id })
    const result = await Shoe.find({}).limit(limit)
    return result
  },
  tshirt: async (_, { _id, limit }, { Tshirt }) => {
    if (_id) return await Tshirt.find({ _id })
    const result = await Tshirt.find({}).limit(limit)
    return result
  },
  pants: async (_, { _id, limit }, { Pant }) => {
    if (_id) return await Pant.find({ _id })
    const result = await Pant.find({}).limit(limit)
    return result
  },
  hats: async (_, { _id, limit }, { Hat }) => {
    if (_id) return await Hat.find({ _id })
    const result = await Hat.find({}).limit(limit)
    return result
  },
}

export default Query
