var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');
const {getConnection} = require("../connectionManager");
const {BlobServiceClient} = require("@azure/storage-blob");


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
    res.json(insertedData);
});


router.get('/flag', function(req, res, next) {
    res.json({ message: 'HKN:{68t73458769q32gyuhaf}' });
});

router.get('/upload', function (req, res, next)  {
    const { BlobServiceClient } = require("@azure/storage-blob");

// Set your Azure Storage connection string
    const connectionString = "DefaultEndpointsProtocol=https;AccountName=p5test;AccountKey=DvxHnZVcWYvIxm7iqlbhyI8ngBwbTxaJGXR4pArlA47vJIqgGAaSW6HNgrCuv4vTln0KhFzIgnaN+AStsKrPSg==;EndpointSuffix=core.windows.net\n";

// Create BlobServiceClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Set the name of the container where you want to upload the file
    const containerName = "binfiles";

// Set the name of the .bin file
    const blobName = "your-file.bin";

// Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(containerName);

// Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

// Specify the path to your local .bin file
    const filePath = "../binfiles/hej.bin";

// Upload the .bin file to Azure Storage
    async function uploadToAzureStorage() {
        try {
            const response = await blockBlobClient.uploadFile(filePath);
            console.log("File uploaded successfully:", response.requestId);
        } catch (error) {
            console.error("Error uploading file to Azure Storage:", error.message);
        }
    }

// Call the upload function
    uploadToAzureStorage();
});

module.exports = router;