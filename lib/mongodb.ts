import { MongoClient } from 'mongodb'
import { MongoConnection } from '../typings'

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DB } = process.env

// type MongoConnection = {
//   client: MongoClient
//   db: Db
// }

// declare global {
//   namespace NodeJS {
//     interface Global {
//       mongo: {
//         conn: MongoConnection | null
//         promise: Promise<MongoConnection> | null
//       }
//     }
//   }
// }


declare global {
  var mongo: {
    conn: MongoConnection | null
    promise: Promise<MongoConnection> | null
  }
}

// https://github.com/vercel/next.js/tree/canary/examples/with-mongodb

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(
      `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.ul1xj.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority`
    ).then(client => ({ client, db: client.db() }))
  }

  cached.conn = await cached.promise
  return cached.conn

}
