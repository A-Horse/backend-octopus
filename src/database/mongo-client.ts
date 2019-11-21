import { configure } from '../configure';

// const MongoClient = require('mongodb').MongoClient;

import { MongoClient, MongoCallback } from 'mongodb';

const assert = require('assert');

// Connection URL
const mongoUrl = configure.get('MONGO_URL');
const mondoDbName = configure.get('MONGO_DB')

// Database Name

// Use connect method to connect to the server
MongoClient.connect(mongoUrl, function(err, client) {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = client.db(mondoDbName);

  client.close();
});


export function getMongoDB(callback: MongoCallback<MongoClient>) {
    return MongoClient.connect(mongoUrl, callback);
}
