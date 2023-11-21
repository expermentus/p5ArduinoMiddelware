// uploadManager.js
const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");
const connectionString = "DefaultEndpointsProtocol=https;AccountName=p5test;AccountKey=DvxHnZVcWYvIxm7iqlbhyI8ngBwbTxaJGXR4pArlA47vJIqgGAaSW6HNgrCuv4vTln0KhFzIgnaN+AStsKrPSg==;EndpointSuffix=core.windows.net";

function uploadToAzureStorage(containerName, filePath) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const fileName = path.basename(filePath);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    return blockBlobClient.uploadFile(filePath);
}

module.exports = uploadToAzureStorage;