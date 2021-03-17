import {
  genToken,
  hastPassword,
  comparePassword,
  validateEmail,
} from '../utils/index'

const Mutation = {
  signUpUser: async (_, { data }, { UserDB }) => {
    const { email, password } = data
    validateEmail(email)
    const emailTaken = await UserDB.findOne({ email })
    if (emailTaken) throw new Error('Email Taken')
    const newPass = hastPassword(password)
    const newUser = new UserDB({ ...data, password: newPass })
    return {
      user: await newUser.save(),
      token: genToken(newUser._id),
    }
  },
  loginUser: async (_, { email, password }, { UserDB }) => {
    validateEmail(email)
    const userExist = await UserDB.findOne({ email })
    if (!userExist) throw new Error('User not found')
    const pass = comparePassword(password, userExist.password)
    if (!pass) throw new Error('Invalid password')
    return { user: userExist, token: genToken(userExist._id) }
  },

  shoesCreate: async (_, { data }, { request, Shoe }) => {
    const newShoe = new Shoe({ ...data })
    return await newShoe.save()
  },
  tshirtCreate: async (_, { data }, { Tshirt }) => {
    const newTshirt = new Tshirt({ ...data })
    return await newTshirt.save()
  },
  pantsCreate: async (_, { data }, { Pant }) => {
    const newPants = new Pant({ ...data })
    return await newPants.save()
  },
  hatsCreate: async (_, { data }, { Hat }) => {
    const newHats = new Hat({ ...data })
    return await newHats.save()
  },

  shoesUpdate: async (_, { _id, data }, { Shoe }) => {
    const productExist = await Shoe.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    const result = await Shoe.findByIdAndUpdate(_id, { ...data }, { new: true })
    return 'hili'
  },
  tshirtUpdate: async (_, { _id, data }, { Tshirt }) => {
    const productExist = await Tshirt.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    return await Tshirt.findByIdAndUpdate(_id, { ...data }, { new: true })
  },
  pantsUpdate: async (_, { _id, data }, { Pant }) => {
    const productExist = await Pant.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    return await Pant.findByIdAndUpdate(_id, { ...data }, { new: true })
  },
  hatsUpdate: async (_, { _id, data }, { Hat }) => {
    const productExist = await Hat.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    return await Hat.findByIdAndUpdate(_id, { ...data }, { new: true })
  },

  shoesDelete: async (_, { _id }, { Shoe }) => {
    const productExist = await Shoe.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    return await Shoe.findByIdAndDelete(_id)
  },
  tshirtDelete: async (_, { _id }, { Tshirt }) => {
    const productExist = await Tshirt.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    return await Tshirt.findByIdAndDelete(_id)
  },
  pantsDelete: async (_, { _id }, { Pant }) => {
    const productExist = await Pant.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    return await Pant.findByIdAndDelete(_id)
  },
  hatsDelete: async (_, { _id }, { Hat }) => {
    const productExist = await Hat.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    return await Hat.findByIdAndDelete(_id)
  },

  stripe: async (_, { data }, { stripe }) => {
    try {
      const { id, amount } = data
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method: id,
        confirm: true,
      })
      console.log({ payment })
    } catch (err) {
      console.log(err)
    } finally {
      return 'hilisss'
    }
  },
}

export default Mutation
