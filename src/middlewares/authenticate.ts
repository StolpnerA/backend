// Dependencies
import { UserModel, User } from '../models/user'
import { Context } from 'koa'
import { verify } from '../helpers/jwt'
import { errors } from '../helpers/errors'
import { InstanceType } from 'typegoose'

export async function authenticate(ctx: Context, next: Function) {
  try {
    const token = ctx.headers.token
    const payload = (await verify(token)) as any
    console.log(payload)
    let user: InstanceType<User>
    if (payload.email) {
      user = await UserModel.findOne({ email: payload.email })
    } else if (payload.facebookId) {
      user = await UserModel.findOne({ facebookId: payload.facebookId })
    } else if (payload.telegramId) {
      user = await UserModel.findOne({ telegramId: payload.telegramId })
    }
    if (!user) {
      return ctx.throw(403, errors.noUser)
    }
    ctx.state.user = user
  } catch (err) {
    return ctx.throw(403, errors.authentication)
  }
  await next()
}
