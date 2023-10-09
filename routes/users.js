var express = require('express');
var router = express.Router();
const mqtt = require('mqtt');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("The temperature is: " + mes + "The humidity is: " + mes2);
});

module.exports = router;
