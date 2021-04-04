import {
  genToken,
  hastPassword,
  comparePassword,
  validateEmail,
} from '../utils/index'
import path from 'path'
import { createWriteStream, existsSync, unlinkSync } from 'fs'
import shortId from 'shortid'

const Mutation = {
  signUpUser: async (_, { data }, { UserDB }) => {
    const { email, password } = data
    await validateEmail(email)
    const emailTaken = await UserDB.findOne({ email })
    if (emailTaken) throw new Error('Este Correo ya existe')
    const newPass = hastPassword(password)
    const newUser = new UserDB({ ...data, password: newPass })
    return {
      user: await newUser.save(),
      token: genToken(newUser._id),
    }
  },
  loginUser: async (_, { email, password }, { UserDB }) => {
    await validateEmail(email)
    const userExist = await UserDB.findOne({ email })
    if (!userExist) throw new Error('User not found')
    const pass = comparePassword(password, userExist.password)
    if (!pass) throw new Error('Invalid password')
    return { user: userExist, token: genToken(userExist._id) }
  },
  userUpdate: async (_, { _id, data }, { UserDB }) => {
    const userExist = UserDB.findById(_id)
    if (!userExist) throw new Error('El usuario no existe')
    const result = await UserDB.findByIdAndUpdate(
      _id,
      { ...data },
      { new: true }
    )
    return result
  },

  signUpAdmin: async (_, { data }, { AdminDB }) => {
    const { email, password } = data
    await validateEmail(email)
    const emailTaken = await AdminDB.findOne({ email })
    if (emailTaken) throw new Error('Email Taken')
    const newPass = hastPassword(password)
    const newAdmin = new AdminDB({ ...data, password: newPass })
    return {
      admin: await newAdmin.save(),
      token: genToken(newAdmin._id),
    }
  },
  loginAdmin: async (_, { email, password }, { AdminDB }) => {
    await validateEmail(email)
    const adminExist = await AdminDB.findOne({ email })
    if (!adminExist) throw new Error('Admin not found')
    const pass = comparePassword(password, adminExist.password)
    if (!pass) throw new Error('Invalid password')
    return { admin: adminExist, token: genToken(adminExist._id) }
  },
  adminUpdate: async (_, { _id, data }, { AdminDB }) => {
    const adminExist = AdminDB.findById(_id)
    if (!adminExist) throw new Error('Administrador no existe')
    const result = await AdminDB.findByIdAndUpdate(
      _id,
      { ...data },
      { new: true }
    )
    return result
  },

  loginThirdServices: async (_, { data }, { UserThirdServices }) => {
    const { email } = data
    const emailExist = await UserThirdServices.findOne({ email })
    if (emailExist)
      return { thirdServices: emailExist, token: genToken(emailExist._id) }
    const newUserThirdServices = new UserThirdServices({ ...data })
    return {
      thirdServices: await newUserThirdServices.save(),
      token: genToken(newUserThirdServices._id),
    }
  },
  thirdServicesUpdate: async (_, { _id, data }, { UserThirdServices }) => {
    const userExist = UserThirdServices.findById(_id)
    if (!userExist) throw new Error('El usuario no existe')
    const result = await UserThirdServices.findByIdAndUpdate(
      _id,
      { ...data },
      { new: true }
    )
    return result
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
    return result
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

  stripe: async (_, { data }, { stripe, pubsub }) => {
    try {
      const {
        id,
        amount,
        name,
        imgUser,
        phoneNumber,
        email,
        brand,
        model,
        price,
        imgProduct,
      } = data
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method: id,
        confirm: true,
      })
      pubsub.publish('sells', {
        sells: {
          name,
          imgUser,
          phoneNumber,
          email,
          brand,
          model,
          price,
          imgProduct,
        },
      })
    } catch (err) {
      console.log(err)
      return false
    } finally {
      return true
    }
  },

  userCartInc: async (_, { _id, data }, { UserDB }) => {
    try {
      const userExist = await UserDB.findById(_id)
      if (!userExist) throw new Error('El Usuario no existe')
      await UserDB.findByIdAndUpdate(
        _id,
        { $push: { cart: { ...data } } },
        { new: true }
      )
      return true
    } catch (error) {
      return false
    }
  },
  userCartDec: async (_, { _id, productId }, { UserDB }) => {
    try {
      const userExist = await UserDB.findById(_id)
      if (!userExist) throw new Error('El Usuario no existe')
      await UserDB.findByIdAndUpdate(_id, {
        $pull: { cart: { _id: productId } },
      })
      return true
    } catch (error) {
      return false
    }
  },
  userShoppingInc: async (_, { _id, data }, { UserDB }) => {
    const userExist = await UserDB.findById(_id)
    if (!userExist) throw new Error('El Usuario no existe')
    const result = await UserDB.findByIdAndUpdate(
      _id,
      { $push: { shopping: { ...data } } },
      { new: true }
    )
    return result
  },

  thirdUserCartInc: async (_, { _id, data }, { UserThirdServices }) => {
    try {
      const userExist = await UserThirdServices.findById(_id)
      if (!userExist) throw new Error('El Usuario no existe')
      await UserThirdServices.findByIdAndUpdate(
        _id,
        { $push: { cart: { ...data } } },
        { new: true }
      )
      return true
    } catch (error) {
      return false
    }
  },
  thirdUserCartDec: async (_, { _id, productId }, { UserThirdServices }) => {
    try {
      const userExist = await UserThirdServices.findById(_id)
      if (!userExist) throw new Error('El Usuario no existe')
      await UserThirdServices.findByIdAndUpdate(_id, {
        $pull: { cart: { _id: productId } },
      })
      return true
    } catch (error) {
      return false
    }
  },
  thirdUserShoppingInc: async (_, { _id, data }, { UserThirdServices }) => {
    const userExist = await UserThirdServices.findById(_id)
    if (!userExist) throw new Error('El Usuario no existe')
    const result = await UserThirdServices.findByIdAndUpdate(
      _id,
      { $push: { shopping: { ...data } } },
      { new: true }
    )
    return result
  },

  adminSalesInc: async (_, { data }, { AdminDB }) => {
    try {
      const adminExist = await AdminDB.findById('60566943bfe0434ed4cf4c01')
      if (!adminExist) throw new Error('El Administrador no existe')
      await AdminDB.findByIdAndUpdate(
        '60566943bfe0434ed4cf4c01',
        { $push: { sales: { ...data } } },
        { new: true }
      )
      return true
    } catch (error) {
      return false
    }
  },

  singleUpload: async (
    _,
    { file, _id, typeProduct },
    { Shoe, Pant, Tshirt, Hat }
  ) => {
    const { createReadStream, filename } = await file
    const stream = createReadStream()
    const serverFilename = `${shortId.generate()}-${filename}`
    const pathName = path.join(__dirname, `../public/images/${serverFilename}`)
    await stream.pipe(createWriteStream(pathName))

    switch (typeProduct) {
      case 'Shoes':
        const productExistShoes = await Shoe.findById(_id)
        if (!productExistShoes) throw new Error('El producto no existe')
        await Shoe.findByIdAndUpdate(_id, {
          $push: { imgs: `http://localhost:5000/${serverFilename}` },
        })
        break

      case 'Pants':
        const productExistPants = await Pant.findById(_id)
        if (!productExistPants) throw new Error('El producto no existe')
        await Pant.findByIdAndUpdate(_id, {
          $push: { imgs: `http://localhost:5000/${serverFilename}` },
        })
        break
      case 'Tshirt':
        const productExistTshirt = await Tshirt.findById(_id)
        if (!productExistTshirt) throw new Error('El producto no existe')
        await Tshirt.findByIdAndUpdate(_id, {
          $push: { imgs: `http://localhost:5000/${serverFilename}` },
        })
        break
      case 'Hats':
        const productExistHats = await Hat.findById(_id)
        if (!productExistHats) throw new Error('El producto no existe')
        await Hat.findByIdAndUpdate(_id, {
          $push: { imgs: `http://localhost:5000/${serverFilename}` },
        })
        break
    }

    return { path: `http://localhost:5000/${serverFilename}` }
  },

  deleteImgUploaded: async (
    _,
    { pathImg, typeProduct, productId },
    { Shoe, Pant, Tshirt, Hat }
  ) => {
    try {
      const serverPath = pathImg.replace('http://localhost:5000/', '')
      const fileToDelete = path.join(
        __dirname,
        `../public/images/${serverPath}`
      )
      if (existsSync(fileToDelete)) {
        unlinkSync(fileToDelete)
      } else return false
      switch (typeProduct) {
        case 'Shoes':
          const shoesExists = await Shoe.findById(productId)
          if (!shoesExists) throw new Error('El product no existe')
          await Shoe.findByIdAndUpdate(productId, { $pull: { imgs: pathImg } })
          return true
        case 'Pants':
          const pantsExists = await Pant.findById(productId)
          if (!pantsExists) throw new Error('El product no existe')
          await Pant.findByIdAndUpdate(productId, { $pull: { imgs: pathImg } })
          return true
        case 'Tshirt':
          const tshirtExists = await Tshirt.findById(productId)
          if (!tshirtExists) throw new Error('El product no existe')
          await Tshirt.findByIdAndUpdate(productId, {
            $pull: { imgs: pathImg },
          })
          return true
        case 'Hats':
          const hatsExists = await Hat.findById(productId)
          if (!hatsExists) throw new Error('El product no existe')
          await Hat.findByIdAndUpdate(productId, { $pull: { imgs: pathImg } })
          return true
      }
    } catch (error) {
      return false
    }
  },
}

export default Mutation
