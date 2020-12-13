// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  return res.status(200).json({message: 'Hello World!'});
})

app.post('/bookmarks', (req, res) => {
  const { url, title } = req.body;
  if(!url || !title){
    return res.status(422).json({error: 'required field(s) missing'});
  }
  return connection.query('INSERT INTO bookmark (url, title) VALUES(?, ?)', [url, title], (err,results) => {
    if(err){
      return res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    }
   return connection.query('SELECT * FROM bookmark WHERE id=?', results.insertId, (err2, record) => {
    if (err2) {
      return res.status(500).json({
        error: err2.message,
        sql: err2.sql,
      });
    }
    return res.status(201).json(record[0]);
  })
  })
})

app.get('/bookmarks/:id', (req, res) => {
  return connection.query('SELECT * FROM bookmark WHERE id=?', [req.params.id], (err, results) => {
    if(err){
      return res.status(501).json({ error: err.message, sql: err.sql });
    }
    if (results.length ===0) {
      return res.status(404).json({error :'Bookmark not found'})
    }
    return res.status(200).json(results[0]);
  });
})

module.exports = app;
