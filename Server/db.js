const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'Tradec';
const objectID = mongodb.ObjectID;

module.exports = function onConnect(callback) {
  MongoClient.connect(url, function (err, client) {
    const db = client.db(dbName);
    callback(client, db, objectID);
  });
}
