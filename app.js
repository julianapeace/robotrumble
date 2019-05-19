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

const body_parser = require('body-parser');
const port = process.env.PORT || 8181;
var firebase = require('firebase')
var config = {
      apiKey: "AIzaSyCROZYabBmr8eZlcbkRPmTvJcv8j2ZTlLE",
      authDomain: "robotrumble-dcb1c.firebaseapp.com",
      databaseURL: "https://robotrumble-dcb1c.firebaseio.com",
      projectId: "robotrumble-dcb1c",
      storageBucket: "robotrumble-dcb1c.appspot.com",
      messagingSenderId: "214277502253"
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
app.get('/moveRobot', webThree.moveRobot)
app.get('/GetWinnings', webThree.GetWinnings)
app.get('/startGame', webThree.startGame)
app.get('/endGame', webThree.endGame)

app.get('/writeToDb', function (req, res) {
  rootRef.child('robots').child('robot1/bidPoolApplicants').set({'0xmadeupaddress': 2})
})

app.listen(port, function () {
  console.log('listening on port ' + port)
});
