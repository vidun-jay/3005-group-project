require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();

// create a connection pool for connecting to the database
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// point root url to login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// GET route handler for login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

// GET route handler for registration page
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
});

// GET route handler for dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/views/dashboard.html');
});

// POST route handler for register page
app.post('/register', async (req, res) => {
    // get email and password pair from the web page
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // query to check if the email already exists
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length > 0) {
            // if the email already exists, say so
            res.send('Email already exists');
        } else {
            // otherwise insert user and hashed password into database
            pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword], (error, results) => {
                if (error) {
                    throw error;
                }
                // once done, redirect user to login page
                res.redirect('/login');
            });
        }
    });
});

// POST route handeler for login page
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length > 0) {
            const isValid = await bcrypt.compare(password, results.rows[0].password);
            if (isValid) {
                // TODO: rest of the website
                res.redirect('/dashboard');
            } else {
                res.send('Invalid password');
            }
        } else {
            res.send('User does not exist');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});