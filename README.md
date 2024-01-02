![](https://badgen.net/static/node/v21.1.0/green)
![](https://badgen.net/badge/icon/postgresql?icon=postgresql&label)

# COMP 3005A - Project: Health and Fitness Club Management System

## 💾 Creating the Database
Run a PostgreSQL server and create a new database in pgAdmin. In the root directory, create a `.env` file (omitted for security purposes) that includes the following information, substituting the placeholder values for the correct ones:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=<database name>
```
**⚠️ Note:** This assumes default credentials for postgres server.

The `DB_DATABASE` variable **must** be set to the name of the newly created database. Ensure these values are correct as they are loaded into the rest of the application and **necessary** for it to run correctly.

## 🛠️ Running the Server
To run the web server, ensure that `node.js` is installed (see [How to Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)). Then, download all of the required packages by running:

```shell
npm install
```

and run the web server using:

```shell
node server.js
```

It should then be available on http://localhost:3000/.
