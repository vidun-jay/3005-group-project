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
);

-- Create user information table (stores height and weight)
CREATE TABLE user_info (
    user_id INT,
    height INT,
    weight FLOAT
);

-- Create classes table
CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    instructor_name VARCHAR(255) NOT NULL,
    schedule DATE NOT NULL
);

-- Records which users have registered for which classes.
CREATE TABLE class_registrations (
    registration_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    class_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);