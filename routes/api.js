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
    const codeContent = req.body;

    // Create a file with the code content
    fs.writeFile('./sketch_files/codeFile.ino', codeContent, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });

    try {
        // Get relative path and construct the full path to arduino-cli.exe
        const scriptDir = process.cwd();
        const cli_path = path.join(scriptDir,'arduino_code', 'Auto-Detect', 'board_detection', 'arduino-cli_0.34.2_Windows_64bit', 'arduino-cli.exe')
        // TODO:
        // sketch_path
        // board_name
        const dump_path = path.join(scriptDir, 'binfiles')


        // script dir:
        const pythonScript = path.join(scriptDir, 'arduino_code', 'Auto-Detect', 'board_detection', 'server_compile.py');

        // arguments for function:
        // TODO: define sketch path and get board name
        let sketch_path = scriptDir + '/sketch_files/codeFile.ino';
        const arguments = [cli_path, sketch_path, 'Arduino MKR WiFi 1010', dump_path];

        // Spawn a child process to run the Python script
        const pythonProcess = spawn('python', [pythonScript, ...arguments]);

        // Listen for data from the Python script's stdout
        await pythonProcess.stdout.on('data', (data) => {
        console.log(`Python Output: ${data}`);
        });

        // Listen for errors from the Python script's stderr
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        // Listen for the Python script to exit
        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
        });


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