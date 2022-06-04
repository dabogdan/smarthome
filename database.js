//this is a separate module of database connection
const mysql = require("mysql2");
// mysql is outdated and mysql2 does not support asynchronous syntax.
// To address this, I chose 'util' and its 'promisify()' method, rather then mysql/promise,
// because it wraps any function, including db-query and
// does not require change of the whole program to async syntax,
// like .then(), catch() and so on.
const util = require("util");

//create db connection with mysql2
const connection = mysql.createConnection({
    host: "localhost",
    database: "my_smart_home",
    user: "root",
    password: ""
});

//connect database
connection.connect((error) => {
    if (error) {
        throw error;
    } else {
        console.log("Database 'my_smart_home' is connected");
    }
});

//make it asynchronous
const dbQuery = util.promisify(connection.query.bind(connection));

module.exports = dbQuery;