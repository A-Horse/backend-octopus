import { configure } from '../config/configure';

import { MongoClient } from 'mongodb';

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
