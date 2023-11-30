-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create goals table
CREATE TABLE goals (
    user_id INT,
    goal_id INT
)

-- Create user information table (stores height and weight)
CREATE TABLE user_info (
    user_id INT,
    height INT,
    weight FLOAT
)