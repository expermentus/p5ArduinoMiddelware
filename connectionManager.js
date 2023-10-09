const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');

// Load environment variables from a .env file
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME, // Replace with your database username
    password: process.env.DB_PASSWORD, // Replace with your database password
    database: 'selfservice',
    charset: 'utf8mb4', // Character encoding (optional)
});

module.exports = {
    getConnection: function () {
        return connection;
    },
};
