var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');
const {getConnection} = require("../connectionManager");
const {BlobServiceClient} = require("@azure/storage-blob");
const uploadToAzureStorage = require("../uploadManager");


router.post('/test', function(req, res, next) {
    const jsonData = req.body;

    if (!jsonData) {
        return res.status(400).json({ error: 'Missing JSON data in the request body' });
    }

    // Process the received JSON data
    try {
        const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        console.log('Received JSON data:', parsedData);

        // Check if the parsed data is an array
        if (Array.isArray(parsedData)) {
            // Iterate over each object in the array
            parsedData.forEach(item => {
                // Check if the object has 'arduino' property
                if (item.hasOwnProperty('arduino') && Array.isArray(item.arduino)) {
                    // Add each Arduino model to the global array 'arduinos'
                    arduinos = arduinos.concat(item.arduino);
                }
            });
        } else {
            console.error('Invalid JSON data format. Expected an array.');
            return res.status(400).json({ error: 'Invalid JSON data format. Expected an array.' });
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
    res.json(insertedData);
});


router.get('/flag', function(req, res, next) {
    res.json({ message: 'HKN:{68t73458769q32gyuhaf}' });
});

router.get('/upload', async function (req, res, next) {
    try {
        const containerName = "binfiles";
        const filePath = "./binfiles/hej.bin";
        const response = await uploadToAzureStorage(containerName, filePath);

        console.log("File uploaded successfully:", response.requestId);
        res.send("File uploaded successfully");
    } catch (error) {
        console.error("Error uploading file to Azure Storage:", error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;