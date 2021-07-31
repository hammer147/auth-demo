import { MongoClient } from 'mongodb'

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DATABASE } = process.env

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.ul1xj.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`
  )
  return client
}
