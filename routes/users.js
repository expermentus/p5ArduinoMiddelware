var express = require('express');
var router = express.Router();
const mqtt = require('mqtt');


/* GET users listing. */
router.get('/', function(req, res, next) {
  let mess = NaN;
  res.send("<p>The temperature is: " + mes + " </p> <p>The humidity is: " + mes2 + "</p>");
  while (true){
    if (mes !== mess){
      res.redirect('users')
      break
    }
  }

});

module.exports = router;
