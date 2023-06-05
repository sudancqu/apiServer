const express = require('express')
const middleware = require('./middleware')
const app = express()
var cors = require('cors')
app.use(cors())

//// Change port number
const port = 3000

var bodyParser = require('body-parser')
app.use(bodyParser.json() )

app.get('/expenses', middleware.initializeMongo, async (req, res) => {
  var expenses = []
  try {
    const database = req.client.db('mobileapp');
    const coll = database.collection('expenses');
    // Query for a movie that has the title 'Back to the Future'
    // const query = { title: 'Back to the Future' };
    expenses = await coll.find({}).toArray()
  } catch(e) {
    res.status(500).json(e)
  }finally {
    // Ensures that the client will close when you finish/error
    await req.client.close();
  }
  res.status(200).json(expenses)
})

app.post('/expenses', middleware.initializeMongo, async (req, res) => {
  try {
      console.log('Receiving data ', req.body)
      const {title, category, amount, date} = req.body
      const database = req.client.db('mobileapp');
      const expenses = database.collection('expenses');
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const doc = {
          'title': title,
          'category': category,
          'amount': amount,
          'date': date
        }
      console.log(doc)
      await expenses.insertOne(doc);
    } finally {
      // Ensures that the client will close when you finish/error
      await req.client.close();
    }
    res.status(200).json({})

})

app.delete('/expenses',middleware.initializeMongo, async (req, res) => {
    
  var fetched = {}
  try {
      const database = req.client.db('mobileapp');
      const coll = database.collection('expenses');
      await coll.deleteOne({})
      console.log(fetched);
    } finally {
      // Ensures that the client will close when you finish/error
      await req.client.close();
    }
    res.status(200).json({})

})

app.delete('/expenses/:id',middleware.initializeMongo, async (req, res) => {
    
  var fetched = {}
  try {
      const id = req.params.id
      console.log('deleting ....', id)
      const database = req.client.db('mobileapp');
      const coll = database.collection('expenses');
      await coll.deleteOne({"_id": `ObjectId(${id})`})
      console.log(fetched);
    } finally {
      // Ensures that the client will close when you finish/error
      await req.client.close();
    }
    res.status(200).json({})

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})