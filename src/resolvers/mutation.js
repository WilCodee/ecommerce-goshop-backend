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
    // await validateEmail(email)
    const emailTaken = await UserDB.findOne({ email })
    if (emailTaken) throw new Error('Este Correo ya existe')
    const newPass = hastPassword(password)
    const newUser = new UserDB({ ...data, password: newPass })
    return {
      user: await newUser.save(),
      token: genToken(newUser._id),
    }
  },
  loginUser: async (_, { email, password }, { UserDB, AdminDB }) => {
    // await validateEmail(email)
    const userExist = await UserDB.findOne({ email })
    if (!userExist) {
      // throw new Error('Usuario no existe')
      const adminExist = await AdminDB.findOne({ email })
      if (!adminExist) {
        throw new Error('Usuario no existe')
      } else {
        const pass = comparePassword(password, adminExist.password)
        if (!pass) throw new Error('Contraseña incorrecta ad')
        return { admin: adminExist, token: genToken(adminExist._id) }
      }
    } else {
      const pass = comparePassword(password, userExist.password)
      if (!pass) throw new Error('Contraseña incorrecta')
      return { user: userExist, token: genToken(userExist._id) }
    }
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
    if (emailTaken) throw new Error('Este Correo ya existe')
    const newPass = hastPassword(password)
    const newAdmin = new AdminDB({ ...data, password: newPass })
    return {
      admin: await newAdmin.save(),
      token: genToken(newAdmin._id),
    }
  },
  loginAdmin: async (_, { email, password }, { AdminDB }) => {
    // await validateEmail(email)
    const adminExist = await AdminDB.findOne({ email })
    if (!adminExist) throw new Error('Admin no encontrado')
    const pass = comparePassword(password, adminExist.password)
    if (!pass) throw new Error('Contraseña incorrecta')
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
        $pull: { cart: { productId } },
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
      const result = await UserThirdServices.findByIdAndUpdate(
        _id,
        {
          $pull: { cart: { productId } },
        },
        { new: true }
      )
      return result
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

  singleUpload: async (_, { file, _id }, { Products }) => {
    const { createReadStream, filename } = await file
    const stream = createReadStream()
    const serverFilename = `${shortId.generate()}-${filename}`
    const pathName = path.join(__dirname, `../public/images/${serverFilename}`)
    await stream.pipe(createWriteStream(pathName))

    const productExist = await Products.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    await Products.findByIdAndUpdate(_id, {
      $push: { imgs: `http://localhost:5000/${serverFilename}` },
    })
    return { path: `http://localhost:5000/${serverFilename}` }
  },
  deleteImgUploaded: async (_, { pathImg, productId }, { Products }) => {
    try {
      const serverPath = pathImg.replace('http://localhost:5000/', '')
      const fileToDelete = path.join(
        __dirname,
        `../public/images/${serverPath}`
      )
      if (existsSync(fileToDelete)) {
        unlinkSync(fileToDelete)
      } else return false

      const productExists = await Products.findById(productId)
      if (!productExists) throw new Error('El producto no existe')
      await Products.findByIdAndUpdate(productId, { $pull: { imgs: pathImg } })
      return true
    } catch (error) {
      return false
    }
  },

  createProduct: async (_, { data }, { Products }) => {
    const newProduct = new Products({ ...data })
    const result = await newProduct.save()
    return result
  },
  updateProduct: async (_, { _id, data }, { Products }) => {
    const productExist = await Products.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    const result = await Products.findByIdAndUpdate(
      _id,
      { ...data },
      { new: true }
    )
    return result
  },
  deleteProduct: async (_, { _id }, { Products }) => {
    const productExist = await Products.findById(_id)
    if (!productExist) throw new Error('El producto no existe')
    const result = await Products.findByIdAndDelete(_id)
    return result
  },

  uploadBanner: async (_, { file, _id, href }, { AdminDB }) => {
    const { createReadStream, filename } = await file
    const stream = createReadStream()
    const serverFilename = `${shortId.generate()}-${filename}`
    const pathName = path.join(__dirname, `../public/images/${serverFilename}`)
    await stream.pipe(createWriteStream(pathName))

    const adminExist = await AdminDB.findById(_id)
    if (!adminExist) throw new Error('Admin no existe')
    await AdminDB.findByIdAndUpdate(_id, {
      $push: {
        banner: { href, path: `http://localhost:5000/${serverFilename}` },
      },
    })
    return { path: `http://localhost:5000/${serverFilename}` }
  },
  deleteBanner: async (_, { pathImg, _id }, { AdminDB }) => {
    try {
      const serverPath = pathImg.replace('http://localhost:5000/', '')
      const fileToDelete = path.join(
        __dirname,
        `../public/images/${serverPath}`
      )
      if (existsSync(fileToDelete)) {
        unlinkSync(fileToDelete)
      } else throw 'La imagen no existe'

      const adminExists = await AdminDB.findById(_id)
      if (!adminExists) throw 'Admin no existe'
      await AdminDB.findByIdAndUpdate(_id, {
        $pull: { banner: { path: pathImg } },
      })
      return true
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default Mutation
