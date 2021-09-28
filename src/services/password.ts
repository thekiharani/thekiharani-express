import bcrypt from 'bcryptjs'

export const makeHash = async (text: string): Promise<string> => {
  const hashed = await bcrypt.hash(text, 10)
  return hashed
}

export const compareHash = async (
  text: string,
  hashed: string
): Promise<boolean> => {
  const verified = await bcrypt.compare(text, hashed)
  return verified
}

export default { makeHash, compareHash }
