const Query = {
  user: async (_, { _id }, { UserDB }) => {
    try {
      if (!_id) return await UserDB.find({})
      if (_id) return await UserDB.find({ _id })
    } catch (error) {
      throw new Error('Algo salio mal')
    }
  },
  admin: async (_, { _id }, { AdminDB }) => {
    try {
      const data = await AdminDB.findById(_id)
      return data
    } catch (error) {
      throw new Error('Algo salio mal')
    }
  },
  thirdUser: async (_, { _id }, { UserThirdServices }) => {
    try {
      if (!_id) return await UserThirdServices.find({})
      return await UserThirdServices.find({ _id })
    } catch (error) {
      throw new Error('Algo salio mal')
    }
  },

  product: async (_, { _id, typeProduct, limit }, { Products }) => {
    try {
      if (_id) return await Products.find({ _id })
      if (typeProduct) return await Products.find({ typeProduct }).limit(limit)
      return await Products.find({}).limit(limit)
    } catch (error) {
      throw new Error('Algo salio mal')
    }
  },
}

export default Query
