import { MongoClient } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { hashPassword } from '../../lib/auth'
import { connectToDatabase } from '../../lib/db'

type Data = {
  message: string
}

type User = {
  email?: string
  password?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email, password } = req.body as User

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    return res.status(422).json({ message: 'Invalid input.' })
  }

  let client: MongoClient
  try {
    client = await connectToDatabase()
  } catch (error) {
    return res.status(500).json({ message: 'Could not connect to database.' })
  }

  const db = client.db()

  const hashedPassword = await hashPassword(password)

  const result = await db.collection('users').insertOne({ email, password: hashedPassword })

  res.status(201).json({ message: 'Created user.' })
}
