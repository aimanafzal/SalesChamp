module.exports = {
  // "mongoURL" : process.env.MONGO_URL || 'localhost',
  // "mongoUser" : process.env.MONGO_USER || '',
  // "mongoPass" : process.env.MONGO_PASS || '',
  // "mongoDBName" : process.env.MONGO_DB_NAME',
  "mongoURL": "mongodb+srv://coder123:coder123@cluster0-ogre3.mongodb.net/test?retryWrites=true&w=majority",

  "replicaSet" : process.env.MONGO_REPLICA_SET_NAME || 'rs0'
};
