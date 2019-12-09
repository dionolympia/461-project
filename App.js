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
const{homepage, titlepage, lyricspage, artistpage, genrepage, yearpage} = require('./routes/index.js');

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
    QUERY3 = "SELECT year as `top_year`, COUNT(year) as `year_freq` FROM song_data WHERE artist=? GROUP BY year ORDER BY `year_freq` DESC LIMIT 1";
    QUERY4 = "SELECT year as `year`, COUNT(year) as `song_count` FROM song_data WHERE artist=? GROUP BY year;";
    db.query(QUERY1, [req.params.artist], function(err, result1) {
      db.query(QUERY2, [req.params.artist], function(err, result2) {
        db.query(QUERY3, [req.params.artist], function(err, result3) {
          db.query(QUERY4, [req.params.artist], function(err, result4) {
            console.log(result1);
            console.log(result2);
            console.log(result3);
            console.log(result4);
            res.render('artistspecific', {artist: req.params.artist, songs : result1, genres: result2, years: result3, yearstats: result4});
          });
        });
      });
    });
});
app.get('/artistpage', artistpage);

// GENRE PAGES
app.get('/genre/:genre/:page', (req, res) => {
    console.log(typeof req.params.page);
    if(req.params.page < 0){
      db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE genre = ? LIMIT 10 OFFSET ?;', [req.params.genre, (parseInt(req.params.page, 10) + 1) * 10], (err, results) => {
          if (!err)
              res.render('genre', {genres: results, pagenumber: req.params.page, genrename: req.params.genre});
          else
              console.log(err);
      });
    }
    else{
      db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE genre = ? LIMIT 10 OFFSET ?;', [req.params.genre, parseInt(req.params.page, 10) * 10], (err, results) => {
          if (!err)
              res.render('genre', {genres: results, pagenumber: req.params.page, genrename: req.params.genre});
          else
              console.log(err);
      });
    }
});
app.get('/genrepage', genrepage);

// YEAR PAGES
app.get('/year/search/:year/:page', (req, res) => {
  if(req.params.page < 0){
    db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE year = ? LIMIT 10 OFFSET ?', [req.params.year, (parseInt(req.params.page, 10)+1) * 10], (err, results) => {
        if (!err)
            res.render('year', {years :results, pagenumber: req.params.page, curryear: req.params.year});
        else
            console.log(err);
    });
  }
  else{
    db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE year = ? LIMIT 10 OFFSET ?', [req.params.year, parseInt(req.params.page, 10) * 10], (err, results) => {
        if (!err)
            res.render('year', {years :results, pagenumber: req.params.page, curryear: req.params.year});
        else
            console.log(err);
    });
  }
});
app.get('/yearpage', yearpage);

// LYRICS PAGES
app.get('/lyrics/search/:lyric/:page', (req, res) => {
    if(req.params.page < 0){
      db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE lyrics LIKE ? LIMIT 10 OFFSET ?', ["%"+req.params.lyric+"%", (parseInt(req.params.page, 10) + 1) * 10], (err, results) => {
          if (!err)
              res.render('lyrics', {lyrics:results, pagenumber: req.params.page, currlyric: req.params.lyric});
          else
              console.log(err);
      });
    }
    else{
      db.query('SELECT id as `id`, title as `title`, year as `year`, artist as `artist`, genre as `genre`, lyrics as `lyrics` FROM song_data WHERE lyrics LIKE ? LIMIT 10 OFFSET ?', ["%"+req.params.lyric+"%", parseInt(req.params.page, 10) * 10], (err, results) => {
          if (!err)
              res.render('lyrics', {lyrics:results, pagenumber: req.params.page, currlyric: req.params.lyric});
          else
              console.log(err);
      });
    }
});
app.get('/lyricspage', lyricspage);
