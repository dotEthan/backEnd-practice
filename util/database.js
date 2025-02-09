const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    //r4mo
    'mongodb+srv://estrauss:[PASSWORD]@node-complete.oavqn.mongodb.net/shop?retryWrites=true&w=majority&appName=Node-Complete'
  )
    .then((client) => {
      console.log('Mongo Connected!');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log('mongoClient COnnect err: ', err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database Found';
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
