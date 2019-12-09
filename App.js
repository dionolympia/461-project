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

// Set port for server
var port = 3000;

// Configure Middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder

// Routing files
const{homepage, titlepage, lyricspage, artistpage, genrepage, yearpage, filterpage} = require('./routes/index.js');

// Setup for MySQL connection
const db = mysql.createConnection({
    host: 'cmsc461project.crie639zueql.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'cmsc461project',
    multipleStatements: true
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

// TITLE PAGES
app.get('/title/search/:title', (req, res) => {
    console.log(req.params.title);

    db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE title LIKE ?', ["%"+req.params.title+"%"], (err, results) => {
        if (!err)
            res.render('title', {titles:results});
        else
            console.log(err);
    });
});
app.get('/titlepage', titlepage);

// ARTIST PAGES
app.get('/artist/search/:artist', (req, res) => {
    db.query('SELECT DISTINCT artist as `artist` FROM song_data WHERE artist LIKE ? ORDER BY artist', ["%"+req.params.artist+"%"], (err, results) => {
        if (!err)
            res.render('artist', {artists:results});
        else
            console.log(err);
    });
});
app.get('/artist/letter/:letter', (req, res) => {
    db.query('SELECT DISTINCT artist as `artist` FROM song_data WHERE artist LIKE ? ORDER BY artist', [req.params.letter+"%"], (err, results) => {
        if (!err)
            res.render('artist', {artists:results});
        else
            console.log(err);
    });
});
app.get('/artist/specific/:artist', (req, res) => {
    QUERY1 = "SELECT COUNT(id) as `song_count` FROM song_data WHERE artist = ?";
    QUERY2 = "SELECT genre as `top_genre`, COUNT(genre) as `genre_freq` FROM song_data WHERE artist=? GROUP BY genre ORDER BY `genre_freq` DESC LIMIT 1";
    db.query(QUERY1, [req.params.artist], function(err, result1) {
      db.query(QUERY2, [req.params.artist], function(err, result2) {
        console.log(result1);
        console.log(result2);
        res.render('artistspecific', {artist: req.params.artist, songs : result1, genres: result2});
      });
    });
});
app.get('/artistpage', artistpage);

// GENRE PAGES
app.get('/genre/:genre', (req, res) => {
    db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE genre = ? LIMIT 10 OFFSET 10', [req.params.genre], (err, results) => {
        if (!err)
            res.render('genre', {genres :results});
        else
            console.log(err);
    });
});
app.get('/genrepage', genrepage);

// YEAR PAGES
app.get('/year/search/:year', (req, res) => {
  if(!req.params.year){
    // If year is blank, redirect to same page
    res.redirect('/');
  }
  else{
    db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE year = ? LIMIT 10', [req.params.year], (err, results) => {
        if (!err)
            res.render('year', {years :results});
        else
            console.log(err);
    });
  }
});
app.get('/yearpage', yearpage);

// LYRICS PAGES
app.get('/lyrics/search/:lyric', (req, res) => {
    console.log(req.params.lyric);
    db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE lyrics LIKE ? LIMIT 10', ["%"+req.params.lyric+"%"], (err, results) => {
        if (!err)
            res.render('lyrics', {lyrics:results});
        else
            console.log(err);
    });
});

app.get('/lyricspage', lyricspage);

app.get('/filterpage', filterpage);
