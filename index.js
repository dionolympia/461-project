
// Importing libraries/modules
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

// Initializing express app
var app = express();
app.use(bodyparser.json());

// Setup for MySQL connection
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'imdb'
});

// Establishing (and testing) MySQL connection
mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection success');
    else
        console.log('DB connection failure: ' + JSON.stringify(err, undefined, 2));
})

app.listen(3000, () => console.log('Express server is running at port number: 3000'));

// Get the first 10 rows of the people table
app.get('/people', (req, res) => {
    mysqlConnection.query('SELECT * FROM people LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// Stopped at 12:42 - www.youtube.com/watch?v=4fWWn2Pe2Mk
// Commenting

