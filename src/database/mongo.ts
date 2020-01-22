import { MongoClient, Db } from 'mongodb';
import { configure } from '../config/configure';

export function getMongoDB(): Promise<Db> {
  const mongoUrl = configure.get('MONGO_URL') as string;
  const mongoDb = configure.get('MONGO_DB') as string;
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoUrl, (err, client) => {
      if (err) {
        return reject(err);
      }
      console.log(`connect mongo db ${mongoUrl}`)
      return resolve(client.db(mongoDb));
    });
  });
}
