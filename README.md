![](https://badgen.net/static/node/v21.1.0/green)
![](https://badgen.net/badge/icon/postgresql?icon=postgresql&label)

# COMP 3005A - Project: Health and Fitness Club Management System

## Initial Setup Instructions (Database Creation)
Create a database called `health_fitness_club` and create the users table using the following SQL query:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

## Running the Server
To run the web server, ensure that `node.js` is installed (see [How to Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)). Then, download all of the required packages by running:

```shell
npm init
```

and run the web server using:

```shell
node index.js
```

It should then be available on http://localhost:3000/.

**⚠️ Note:** Ensure that the `.env` file is in the working directory. The application cannot connect to the PostgreSQL server otherwise.
