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

var port = 3000;

// Configure Middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder

// Routing files
const{homepage, titlepage, lyricspage, artistpage, genrepage, yearpage} = require('./routes/index.js');

// Setup for MySQL connection
const db = mysql.createConnection({
    host: 'cmsc461project.crie639zueql.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'cmsc461project'
});

global.db = db;

console.log(__dirname);

// Establishing (and testing) MySQL connection
db.connect((err) => {
    if (!err)
        console.log('DB connection success');
    else
        console.log('DB connection failure: ' + JSON.stringify(err, undefined, 2));
});

app.listen(port, () => console.log(`Express server is running at port number: ${port}`));

// Routes to homepage
app.get('/homepage', homepage);
app.get('', homepage);
app.get('/home', homepage);

// Routes to other pages

// TITLE PAGES
app.get('/title/search/:title', (req, res) => {
    db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE title LIKE ?', ["%"+req.params.title+"%"], (err, results) => {
        if (!err)
            res.render('title', {titles:results});
        else
            console.log(err);
    });
});
app.get('/titlepage', titlepage);

// LYRICS PAGES
app.get('/lyrics/search/:lyrics', (req, res) => {
    db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE lyrics LIKE ?', ["%"+req.params.lyrics+"%"], (err, results) => {
        if (!err)
            res.render('lyrics', {lyrics:results});
        else
            console.log(err);
    });
});
app.get('/lyricspage', lyricspage);

// ARTIST PAGES
app.get('/artist/search/:artist', (req, res) => {
    db.query('SELECT artist as `artist` FROM song_data WHERE artist LIKE ?', ["%"+req.params.artist+"%"], (err, results) => {
        if (!err)
            res.render('artist', {artist:results});
        else
            console.log(err);
    });
});
app.get('/artistpage', artistpage);

// GENRE PAGES
app.get('/genre', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/genre.html', 'utf8');
  myReadStream.pipe(res);
});

// YEAR PAGES
app.get('/year', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/year.html', 'utf8');
  myReadStream.pipe(res);
});

// LYRICS PAGES
app.get('/lyrics', (req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/html/lyrics.html', 'utf8');
  myReadStream.pipe(res);
});


// Stopped at 12:42 - www.youtube.com/watch?v=4fWWn2Pe2Mk
