var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');
const {getConnection} = require("../connectionManager");
const {BlobServiceClient} = require("@azure/storage-blob");
const uploadToAzureStorage = require("../uploadManager");
const { spawn } = require('child_process');
const path = require('path');


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
                    arduinos = item.arduino;
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

router.post('/upload', async function (req, res, next) {
    // Access the code content from the request body
    try {
        // Access the code content from the request body
        const codeContent = req.body;

        // Create a binary file
        const binFilePath = await createBin(codeContent);

        // Upload the binary file to Azure Storage
        const containerName = "binfiles";
        const newFilePath = "./binfiles/casper0.ino.bin";
        fs.rename( binFilePath, newFilePath, () => {});
        const response = await uploadToAzureStorage(containerName, newFilePath);

        console.log("File uploaded successfully:", response.requestId);
        res.send("File uploaded successfully");
    } catch (error) {
        console.error("Error uploading file to Azure Storage:", error.message);
        res.status(500).send("Internal Server Error");
    }
});




async function createBin(codeContent) {
    return new Promise((resolve, reject) => {
        const scriptDir = process.cwd();
        const sketchFilePath = path.join(scriptDir, 'sketch_files', 'sketch_files.ino');
        const binFilePath = path.join(scriptDir, 'binfiles', 'sketch_files.ino.bin');

        // Create a file with the code content
        fs.writeFile(sketchFilePath, codeContent, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                reject(err);
            } else {
                console.log('File written successfully');

                // Run the Python script to create the binary file
                const cliPath = path.join(scriptDir, 'arduino_code', 'Auto-Detect', 'board_detection', 'arduino-cli_0.34.2_Windows_64bit', 'arduino-cli.exe');
                const dumpPath = path.join(scriptDir, 'binfiles');
                const pythonScript = path.join(scriptDir, 'arduino_code', 'Auto-Detect', 'board_detection', 'server_compile.py');
                const arguments = [cliPath, sketchFilePath, 'Arduino MKR WiFi 1010', dumpPath];

                const pythonProcess = spawn('python', [pythonScript, ...arguments]);

                pythonProcess.stdout.on('data', (data) => {
                    console.log(`Python Output: ${data}`);
                });

                pythonProcess.stderr.on('data', (data) => {
                    console.error(`Python Error: ${data}`);
                    reject(data);
                });

                pythonProcess.on('close', (code) => {
                    console.log(`Python process exited with code ${code}`);
                    if (code === 0) {
                        resolve(binFilePath);
                    } else {
                        reject(`Python process exited with code ${code}`);
                    }
                });
            }
        });
    });
}

module.exports = router;