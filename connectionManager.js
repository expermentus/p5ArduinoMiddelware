const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');

// Load environment variables from a .env file
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || '130.225.39.23',
    user: process.env.DB_USER || 'p5',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'IdIoT_Middleware',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4', // Character encoding (optional)
});

module.exports = {
    getConnection: function () {
        return pool.promise();
    },
};