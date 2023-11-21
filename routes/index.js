var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');
const {getConnection} = require("../connectionManager");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Arduino middelware' });
});

router.get('/update', function(req, res, next) {
  res.render('updateDeviceSoftware', { title: 'Arduino middelware' });
});

router.get('/deviceSetup', function(req, res, next) {
  res.render('deviceSetup', { title: 'Device Setup Page' });
  console.log(arduinos)
});

router.post('/deviceSetup', async(req,res) =>{
  const {name, model_name, number_of_pins, chosen_usecase} = req.body;

  // Insert data into the database
  const sql = 'INSERT INTO devices (name, model_name, number_of_pins, chosen_usecase) VALUES (?, ?, ?, ?)';
  const values = [name, model_name, number_of_pins, chosen_usecase];

  getConnection().query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).json({ message: 'Error inserting data into the database' });
      return;
    }

    console.log('Data inserted into the database');
    res.render('deviceSetup', { title: 'Device Setup Page' });
  });
})

module.exports = router;
