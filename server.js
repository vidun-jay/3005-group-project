require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();

// set EJS as the view engine
app.set('view engine', 'ejs');

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
    res.render('login', { message: '' });
});

// GET route handler for registration page
app.get('/register', (req, res) => {
    res.render('register', { message: '' });
});

// GET route handler for dashboard page
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { user: {}, goal: '' });
});

// GET route handler for dashboard page
app.get('/admin', (req, res) => {
    res.render('admin', { user: {}, goal: '' });
});

// GET route handler for dashboard page
app.get('/admin-login', (req, res) => {
    res.render('admin-login', { message: '' });
});

app.get('/instructors', (req, res) => {
    res.render('instructors', { user: {}, goal: '' });
});

// GET handler to query classes database
app.get('/classes', async (req, res) => {
    try {
        const classData = await pool.query('SELECT * FROM classes');
        res.json(classData.rows); // send the data back as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// POST route handler for register page
app.post('/register', async (req, res) => {
    const { email, password, first_name, last_name, height, weight, goal } = req.body;
    const hashed_pass = await bcrypt.hash(password, 10);

    try {
        await pool.query('BEGIN');

        // try to insert user into the `users` table
        const add_user_result = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id',
            [email, hashed_pass, first_name, last_name]
        );

        // get the user ID from the INSERT result
        const user_id = add_user_result.rows[0].id;

        // insert user details into the 'user_info' table
        await pool.query(
            'INSERT INTO user_info (user_id, height, weight) VALUES ($1, $2, $3)',
            [user_id, height, weight]
        );

        // map the goal description to goal_id
        const goal_map = {
            'lose_weight': 1,
            'gain_muscle': 2,
            'cardio': 3,
            'athleticism': 4,
            'other': 5
        };

        const goal_id = goal_map[goal];

        // insert user goal into the 'goals' table
        await pool.query(
            'INSERT INTO goals (user_id, goal_id) VALUES ($1, $2)',
            [user_id, goal_id]
        );

        // commit transaction
        await pool.query('COMMIT');

        // redirect user to login page
        res.redirect('/login');
    } catch (error) {
        // if an error occurs, rollback
        await pool.query('ROLLBACK');
        res.render('register', { message: 'There already exists a user with that email.' });
    }
});

function convertGoalIdToName(goalId) {

    const goal_map = {
        1: 'Lose Weight',
        2: 'Gain Muscle',
        3: 'Cardio',
        4: 'Athleticism',
        5: 'Other'
    };
    return goal_map[goalId] || 'Unknown Goal';
}

// POST route handler for login page
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                let goal_name = '';

                // fetch goal_id from the database and convert it to a goal name
                const goal_result = await pool.query('SELECT goal_id FROM goals WHERE user_id = $1', [user.id]);
                if (goal_result.rows.length > 0) {
                    const goal_id = goal_result.rows[0].goal_id;
                    goal_name = convertGoalIdToName(goal_id); // Make sure this function exists and returns a string
                }
                // pass both user and goalName to the dashboard
                res.render('dashboard', { user: user, goal: goal_name });
            } else {
                res.render('login', { message: 'Invalid password' });
            }
        } else {
            res.render('login', { message: 'User does not exist' });
        }
    } catch (error) {
        console.error(error);
        res.send('An error occurred');
    }
});

// POST route handler for validating admin access key
app.post('/admin-login', (req, res) => {
    const { accessKey } = req.body;

    if (accessKey === "111") {
        res.render('admin', { user: {}, goal: '' });
    } else if (accessKey === "222"){
        res.render('instructors', { user: {}, goal: '' });
    }
     else {
        res.render('admin-login', { message: 'Invalid access key.' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/login`);
});
