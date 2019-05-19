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
// const port = process.env.PORT || 8000;
const port = process.env.PORT || 8181;
var webThree = require('./webThree');
require('dotenv').config();
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
  totalBetsArray = ['50', '30']
  response = '';
  res.render('index.hbs', {
    'response': response,
    'totalBetsA': totalBetsArray[0],
    'totalBetsB': totalBetsArray[1]
  });
});

app.get('/robots', webThree.robots); //gameIntervals()
app.get('/getaccount', webThree.getAccount);

app.listen(port, function () {
  console.log('listening on port ' + port)
});
