import { MongoClient } from 'mongodb';

import { configure } from '../config/configure';

const mongoUrl = configure.get('MONGO_URL');
export const mongoDbName = configure.get('MONGO_DB')

export function getMongoClient(): Promise<MongoClient> {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, (err, client) => {
            if (err) {
                return reject(err);
            }
            return resolve(client);
        }); 
    })
}
