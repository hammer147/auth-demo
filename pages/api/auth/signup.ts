import type { NextApiRequest, NextApiResponse } from 'next'
import { hashPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/mongodb'
import { MongoConnection } from '../../../typings'

type ReqBody = {
  email?: string
  password?: string
}

type ResBody = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  if (req.method !== 'POST') return

  const { email, password } = req.body as ReqBody

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    return res.status(422).json({ message: 'Invalid input.' })
  }

  let connection: MongoConnection

  try {
    connection = await connectToDatabase()
  } catch (error) {
    return res.status(500).json({ message: 'Could not connect to database.' })
  }

  const { client, db } = connection

  const existingUser = await db.collection('users').findOne({ email })

  if (existingUser) {
    // client.close()
    return res.status(422).json({ message: 'User already exists.' })
  }

  const hashedPassword = await hashPassword(password)

  const result = await db.collection('users').insertOne({ email, password: hashedPassword })

  // client.close()
  res.status(201).json({ message: 'Created user.' })
}
