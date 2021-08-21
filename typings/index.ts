import { Db, MongoClient } from 'mongodb'

export type PasswordData = {
  oldPassword: string
  newPassword: string
}

export type MongoConnection = {
  client: MongoClient
  db: Db
}
