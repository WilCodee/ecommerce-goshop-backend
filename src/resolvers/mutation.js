import {
  genToken,
  hastPassword,
  comparePassword,
  validateEmail,
  connectWa,
  sendMsgWa,
} from '../utils/index'
import dotenv from 'dotenv'
dotenv.config()

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

  stripe: async (_, { data }, { stripe }) => {
    try {
      const { id, amount } = data
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method: id,
        confirm: true,
      })
    } catch (err) {
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
      const adminExist = await AdminDB.findById(process.env.ADMIN_ID)
      if (!adminExist) throw new Error('El Administrador no existe')
      await AdminDB.findByIdAndUpdate(
        process.env.ADMIN_ID,
        { $push: { sales: { ...data } } },
        { new: true }
      )
      return true
    } catch (error) {
      return false
    }
  },

  singleUpload: async (_, { pubId, pathImg, _id }, { Products }) => {
    try {
      const productExist = await Products.findById(_id)
      if (!productExist) throw 'El producto no existe'
      await Products.findByIdAndUpdate(_id, {
        $push: { imgs: { pathImg, pubId } },
      })
      return 'subido'
    } catch (error) {
      throw new Error(error)
    }
  },
  deleteImgUploaded: async (
    _,
    { pathImg, productId },
    { Products, Cloudinary }
  ) => {
    try {
      const productExists = await Products.findById(productId)
      if (!productExists) throw 'El producto no existe'
      await Products.findByIdAndUpdate(productId, {
        $pull: { imgs: { pathImg } },
      })

      //saco el resto del publicID para eliminarlo
      const pathArr = pathImg.split('/').slice(-1)[0].split('.')[0]

      const result = await Cloudinary.v2.uploader.destroy(
        `${process.env.CLOUDINARINAME}/${pathArr}`
      )
      if (!result) throw 'fallo al eliminar la imagen del servidor'

      return 'eliminado'
    } catch (error) {
      throw new Error(error)
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

  connectWa: async () => {
    try {
      await connectWa()
      return true
    } catch (error) {
      throw error
    }
  },
  sendMsgWa: async (_, { msg }) => {
    try {
      await sendMsgWa(msg)
      return true
    } catch (error) {
      throw error
    }
  },

  uploadBanner: async (_, { pubId, path, href, _id }, { AdminDB }) => {
    try {
      const adminExist = await AdminDB.findById(_id)
      if (!adminExist) throw 'Admin no existe'
      const result = await AdminDB.findByIdAndUpdate(_id, {
        $push: {
          banner: { href, path, pubId },
        },
      })
      if (!result) throw 'fallo al agregar path/imagen al la base de datos'
      return 'agregado'
    } catch (error) {
      throw new Error(error)
    }
  },
  updateBanner: async (
    _,
    { path, _id, href, pubId, newPubId },
    { Cloudinary, AdminDB }
  ) => {
    try {
      const adminExist = await AdminDB.findById(_id)
      if (!adminExist) throw 'Admin no existe'
      if (path && !href) {
        const file = await AdminDB.find({ _id }, { banner: 1 })
        file[0]?.banner.map(async f => {
          if (f.pubId === pubId) {
            const pathArr = f.path.split('/').slice(-1)[0].split('.')[0]

            await Cloudinary.v2.uploader.destroy(
              `${process.env.CLOUDINARINAME}/${pathArr}`
            )

            await AdminDB.findByIdAndUpdate(_id, {
              $pull: { banner: { pubId } },
            })

            await AdminDB.findByIdAndUpdate(
              _id,
              {
                $push: {
                  banner: { href: f.href, path, pubId: newPubId },
                },
              },
              { new: true }
            )
          }
        })
        // primera
        return 'actualizado'
      } else if (href && !path && pubId && _id) {
        const file = await AdminDB.find({ _id }, { banner: 1 })

        file[0].banner.map(async f => {
          if (f.pubId === pubId) {
            await AdminDB.findByIdAndUpdate(_id, {
              $pull: { banner: { pubId } },
            })

            await AdminDB.findByIdAndUpdate(_id, {
              $push: { banner: { href, path: f.path, pubId: f.pubId } },
            })
          }
        })
        // segunda
        return 'actualizado'
      } else {
        return
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  deleteBanner: async (_, { path, _id }, { Cloudinary, AdminDB }) => {
    try {
      const adminExist = await AdminDB.findById(_id)
      if (!adminExist) throw 'Admin no existe'

      await AdminDB.findByIdAndUpdate(_id, {
        $pull: {
          banner: { path },
        },
      })

      //saco el resto del publicID para eliminarlo
      const pathArr = path.split('/').slice(-1)[0].split('.')[0]

      const result = await Cloudinary.v2.uploader.destroy(
        `${process.env.CLOUDINARINAME}/${pathArr}`
      )
      if (!result) throw 'fallo al eliminar la imagen del servidor'
      return 'eliminado'
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default Mutation
