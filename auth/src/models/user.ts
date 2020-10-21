import mongoose from 'mongoose'
import { Password } from '../services'

interface NewUser {
  email: string
  password: string
}

interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(newUser: NewUser): UserDoc
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true }
  },
  {
    toJSON: {
      transform (_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
      },
      versionKey: false
    }
  }
)

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

userSchema.statics.build = (newUser: NewUser) => new User(newUser)

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
