import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export class Password {
  static async toHash (pw: string) {
    const salt = randomBytes(8).toString('hex')
    const buf = (await scryptAsync(pw, salt, 64)) as Buffer

    return `${buf.toString('hex')}.${salt}`
  }
  static async compare (storedPassword: string, givenPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.')
    const buf = (await scryptAsync(givenPassword, salt, 64)) as Buffer

    return buf.toString('hex') === hashedPassword ? true : false
  }
}
