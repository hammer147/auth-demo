import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { hashPassword, verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/mongodb'
import { MongoConnection, PasswordData } from '../../../typings'

type ReqBody = PasswordData

type ResBody = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  if (req.method !== 'PATCH') return

  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const { email } = session.user!
  const { oldPassword, newPassword } = req.body as ReqBody

  let connection: MongoConnection

  try {
    connection = await connectToDatabase()
  } catch (error) {
    return res.status(500).json({ message: 'Could not connect to database.' })
  }

  const { client, db } = connection

  const usersCollection = db.collection('users')

  const user = await usersCollection.findOne({ email })

  if (!user) {
    // client.close()
    return res.status(404).json({ message: 'User not found' })
  }

  const currentPassword = user.password
  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword)

  if (!passwordsAreEqual) {
    // client.close()
    return res.status(403).json({ message: 'Invalid Password' })
  }

  const hashedPassword = await hashPassword(newPassword)
  const result = usersCollection.updateOne({ email }, { $set: { password: hashedPassword } })

  // client.close()
  res.status(200).json({ message: 'Password updated' })
}
