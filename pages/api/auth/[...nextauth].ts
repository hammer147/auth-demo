import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/mongodb'

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials: Record<'email' | 'password', string>) {
        const { client } = await connectToDatabase()
        const usersCollection = client.db().collection('users')
        const user = await usersCollection.findOne({ email: credentials.email })
        if (!user) {
          // client.close()
          throw new Error('User not found.')
        }
        const isValid = await verifyPassword(credentials.password, user.password)
        if (!isValid) {
          // client.close()
          throw new Error('Could not log in.')
        }
        // client.close()
        return { email: user.email } // will be used to generate JWT
      }
    })
  ]
})
