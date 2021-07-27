// server.js
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
const app = express()
/* Mongodb connection */
MongoClient.connect(url, {
    useNewUrlParser: true
  })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    //body-parser above CRUD handlers
    app.use(bodyParser.urlencoded({
      extended: true
    }))

    // Handlers go below
    /* Server Creation */
    app.listen(8080, function () {
      console.log('listening on 8080')
    });
    /* EJS as the template engine */
    app.set('view engine', 'ejs')
    /* READ - GET */
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
      res.sendFile(__dirname + "/index.html")
      res.render('index.ejs',{ quotes: results })
    });
    /* CREATE - POST */
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(() => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

  })