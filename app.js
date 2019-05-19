/* Copyright (c) 2018 HERC SEZC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var express = require('express')
var cors = require('cors');
var app = express()
var Web3 = require('web3');
require('dotenv').config();

const body_parser = require('body-parser');
const port = process.env.PORT || 8181;
var firebase = require('firebase')
var config = {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_DBURL,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID
    }

firebase.initializeApp(config);
const rootRef = firebase.database().ref();
var webThree = require('./webThree');
app.use(cors());

if (app.get('env') === 'development') {
  environment = {
    environment: 'development'
  };
  app.use(function (err, req, res, next) {
    res.status(err.code || 500)
      .json({
        status: 'error',
        message: err
      });

  });
} else {
  environment = {
    environment: 'production'
  }
}
module.exports.environment = app.get('env');

app.use(express.static('public'));
app.use(body_parser.urlencoded({
  limit: '10mb',
  extended: false
}));
app.use(body_parser.json({
  limit: '10mb',
  extended: false
}))
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  response = '';
  res.render('index.hbs', {
    'response': response
  });
});

app.get('/getGameInterval', webThree.GameInterval);
app.get('/betOnRobot', webThree.betOnRobot);

app.get('/writeToDb', function (req, res) {
  rootRef.child('robots').child('robot1/bidPoolApplicants').set({'0xmadeupaddress': 2})
})

app.listen(port, function () {
  console.log('listening on port ' + port)
});
