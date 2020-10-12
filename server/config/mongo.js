module.exports = {
  "mongoURL": "mongodb+srv://admin:admin@cluster0.uyrpl.mongodb.net/Sales-Champ?retryWrites=true&w=majority",
  "replicaSet" : process.env.MONGO_REPLICA_SET_NAME || 'rs0'
};
