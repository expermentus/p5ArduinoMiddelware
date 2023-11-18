var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');
const {getConnection} = require("../connectionManager");


router.post('/test', function(req, res, next) {
    const jsonData = req.body;

    if (!jsonData) {
        return res.status(400).json({ error: 'Missing JSON data in the request body' });
    }

    // Process the received JSON data
    try {
        const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        console.log('Received JSON data:', parsedData);
        // You can now use parsedData as needed
        if (parsedData.hasOwnProperty('arduino1')) {
            // Update the global array 'arduinos'
            arduinos = parsedData['arduino1'];
        }
        // Respond with a success message
        res.json({ message: 'Received and processed JSON data' });
    } catch (err) {
        console.error('Error parsing JSON data:', err);
        return res.status(400).json({ error: 'Invalid JSON data' });
    }
    console.log('Global array arduinos:', arduinos);
});

router.get('/testget', function(req, res, next) {
    const responseJson = {
        choice: 'choice',
        ssid: 'ssid',
        password: 'password',
        stopic: 'topic',
        mqttun: 'mqttun',
        mqttpw: 'mqttpw'
    };

    res.json(responseJson);
});
router.get('/flag', function(req, res, next) {
    res.json({ message: 'HKN:{68t73458769q32gyuhaf}' });
});


module.exports = router;