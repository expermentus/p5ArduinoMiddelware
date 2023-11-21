// uploadManager.js
const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");

function uploadToAzureStorage(connectionString, containerName, filePath) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const fileName = path.basename(filePath);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    return blockBlobClient.uploadFile(filePath);
}

module.exports = uploadToAzureStorage;