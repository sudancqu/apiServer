const express = require('express')
const middleware = require('./middleware')
const app = express()
var cors = require('cors')
app.use(cors())
var ObjectId = require('mongodb').ObjectId; 
//// Change port number
const port = 3000

var bodyParser = require('body-parser')
app.use(bodyParser.json() )

const categories = [
  'Rent',
  'Food',
  'Shopping',
  'Transport',
  'Others'
]

app.get('/dashboard/:id', middleware.initializeMongo, async (req, res) => {
  try {
    const id = req.params.id
    const database = req.client.db('mobileapp');
    const coll = database.collection('expenses');
    // Query for a movie that has the title 'Back to the Future'
    const query = { 'userId':  id};
    const expenses = await coll.find(query).toArray()
    console.log('Found expenses', expenses)
    var mapped = {}
    categories.forEach(c => {
      mapped[c] = 0
    })
    mapped['Total'] = 0
    expenses.forEach((expense) => {
      mapped[expense.category] += parseFloat(expense['amount' ?? 0])
    })
    console.log(expenses)
    mapped['Total'] = expenses.map(e => parseFloat(e['amount'] ?? 0)).reduce((a,b) => a+b, 0)
    res.status(200).json(mapped)
  } catch(e) {
    res.status(500).json(e)
  }finally {
    // Ensures that the client will close when you finish/error
    await req.client.close();
  }
  
})

app.get('/expenses/:id', middleware.initializeMongo, async (req, res) => {
  try {
    const id = req.params.id
    const database = req.client.db('mobileapp');
    const coll = database.collection('expenses');
    // Query for a movie that has the title 'Back to the Future'
    const query = { 'userId':  id};
    const expenses = await coll.find(query).toArray()
    res.status(200).json(expenses)
  } catch(e) {
    res.status(500).json(e)
  }finally {
    // Ensures that the client will close when you finish/error
    await req.client.close();
  }
  
})

app.post('/expenses', middleware.initializeMongo, async (req, res) => {
  try {
      console.log('Receiving data ', req.body)
      const {title, category, amount, date, userId} = req.body
      const database = req.client.db('mobileapp');
      const expenses = database.collection('expenses');
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const doc = {
          'title': title,
          'category': category,
          'amount': amount,
          'date': date,
          'userId': userId
        }
      console.log(doc)
      await expenses.insertOne(doc);
      res.status(200).json({})
    } finally {
      // Ensures that the client will close when you finish/error
      await req.client.close();
    }
    

})

app.post('/register', middleware.initializeMongo, async (req, res) => {
  try {
      console.log('Receiving data ', req.body)
      const {firstName, lastName, userName, password} = req.body
      if(!(firstName && lastName && userName && password)) {
        res.status(500).json({'error': 'Empty value'})
        return
      }
      const database = req.client.db('mobileapp');
      const users = database.collection('users');
      const query = {'userName': userName}
      const matches = await users.find(query).toArray()
      if(matches.length > 0) {
        res.status(500).json({'error': 'User already exists'})
        return
      }
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const doc = {
          'firstName': firstName,
          'lastName': lastName,
          'userName': userName.toLowerCase(),
          'password': password
        }
      console.log(doc)
      await users.insertOne(doc);
      res.status(200).json({})
    } finally {
      // Ensures that the client will close when you finish/error
      await req.client.close();
    }
    

})

app.post('/login', middleware.initializeMongo, async (req, res) => {
  try {
      const {userName, password} = req.body
      if(!(userName && password)) {
        res.status(500).json({'error': 'Empty value'})
        return
      }
      const database = req.client.db('mobileapp');
      const users = database.collection('users');
      const query = {'userName': userName.toLowerCase(), 'password': password}
      const matches = await users.find(query).toArray()
      if(matches.length > 0) {
        const user = matches[0]
        res.status(200).json(user)
      } else {
        await req.client.close();
        res.status(401).json({'error': 'no user'})
      }
      
    } finally {
      // Ensures that the client will close when you finish/error
      await req.client.close();
    }
    

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
      await coll.deleteOne({"_id": new ObjectId(id)})
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