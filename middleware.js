const { MongoClient } = require("mongodb");

const username = encodeURIComponent('sudansuwal')
const password = encodeURIComponent('00o8CrjvzfKWZjS3')
const clusterName = 'cluster1'
const clusterId = 'kvkjefl'

const uri = `mongodb+srv://${username}:${password}@${clusterName}.${clusterId}.mongodb.net/?retryWrites=true&w=majority`

const initializeMongo = (req,res, next) => {
    const client = new MongoClient(uri);
    req.client = client
    next()
}
exports.initializeMongo = initializeMongo
