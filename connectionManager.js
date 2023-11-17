const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');

// Load environment variables from a .env file
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

const connection = mysql.createConnection({
    host: '130.225.39.23',
    user: 'root', // Replace with your database username
    password: 'root', // Replace with your database password
    database: 'IdIoT_Middleware',
    charset: 'utf8mb4', // Character encoding (optional)
});

module.exports = {
    getConnection: function () {
        return connection;
    },
};
