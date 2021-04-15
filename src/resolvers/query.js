const Query = {
  user: async (_, { _id }, { UserDB }) => {
    const data = await UserDB.findById(_id)
    if (!data) throw new Error('Usuario no existe')
    return data
  },
  admin: async (_, { _id }, { AdminDB }) => {
    const data = await AdminDB.findById(_id)
    if (!data) throw new Error('Admin no existe')
    return data
  },
  thirdUser: async (_, { _id }, { UserThirdServices }) => {
    const data = await UserThirdServices.findById(_id)
    if (!data) throw new Error('Usuario no existe')
    return data
  },

  product: async (_, { _id, typeProduct, limit }, { Products }) => {
    if (_id) return await Products.find({ _id })
    const result = await Products.find({ typeProduct }).limit(limit)
    return result
  },
}

export default Query
