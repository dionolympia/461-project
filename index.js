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

// Use the images folder
app.use(express.static(__dirname + '/images'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

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


app.get('/title/:title', (req, res) => {

    mysqlConnection.query('SELECT title FROM song_data WHERE title = ?', [req.params.title], (err, rows, fields) => {
        if (!err)
            res.render('title', {title:req.params.title})
        else
            console.log(err);
    })
});

app.get('', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/home.html', 'utf8');
  myReadStream.pipe(res);
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
