// Importing libraries/modules
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

// Initializing express app
var app = express();

// Use local files
var path= require('path');

// File stream module
var fs = require('fs');

app.use(express.static(__dirname + '/images'));

// Setup for MySQL connection
var mysqlConnection = mysql.createConnection({
    host: 'cmsc461project.crie639zueql.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'cmsc461project'
});

console.log(__dirname);

// Establishing (and testing) MySQL connection
mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection success');
    else
        console.log('DB connection failure: ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('Express server is running at port number: 3000'));

// Get the first 10 rows of the people table
app.get('/songs', (req, res) => {
    mysqlConnection.query('SELECT * FROM song_data LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});
app.get('/songs/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM song_data WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            //res.send(rows);
            /*
            rows.forEach(function(result){
              res.send(result);
            });
            */
            res.send("<html><body><h1>Hello, World!</h1></body></html>");
        else
            console.log(err);
    })
});

app.get('/home', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/home.html', 'utf8');
  myReadStream.pipe(res);
});

app.get('/title', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/title.html', 'utf8');
  myReadStream.pipe(res);
});

app.get('/artist', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/artist.html', 'utf8');
  myReadStream.pipe(res);
});

app.get('/genre', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/genre.html', 'utf8');
  myReadStream.pipe(res);
});

app.get('/year', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/year.html', 'utf8');
  myReadStream.pipe(res);
});

app.get('/lyrics', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/lyrics.html', 'utf8');
  myReadStream.pipe(res);
});


// Stopped at 12:42 - www.youtube.com/watch?v=4fWWn2Pe2Mk
