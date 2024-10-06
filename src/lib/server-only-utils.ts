import 'server-only'

import bcrypt from 'bcryptjs'

export function hashPassword(plainText: string) {
  return bcrypt.hashSync(plainText, bcrypt.genSaltSync(10))
}

export function verifyPassword(plainText: string, hash: string) {
  return bcrypt.compareSync(plainText, hash)
}
