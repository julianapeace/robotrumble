var qs = require('querystring')
var request = require('request')
var firebase = require('firebase')
var ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
/*
Get Ether Balance for a single Address

https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=YourApiKeyToken

actions
1. balance
2. txlist
3.txlistinternal

txhash=''

OPTIONAL PARAMS:
startblock=0
endpoint=9999999
sort=asc
page
offset
*/

function getEtherBalance(req, res, next) {
  var token = req.headers['authorization'];
  if (!token) return res.status(401).send({
    auth: false,
    message: 'No token provided.'
  });
  firebase.auth().signInWithCustomToken(token)
    .then(user_login => {
      try {
        let address = JSON.parse(Object.keys(req.body)[0]) // pass 0x address here
      } catch (err) {
        queries.logError("HERC: Invalid JSON, possible malicious code", err) /*TODO: must error out elegantly for end user */
      }
      var body = {
        module: 'account',
        action: 'balance',
        address: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
        apikey: ETHERSCAN_API_KEY
      }

      var uri = 'https://api.etherscan.io/api'
      + '?' + qs.stringify(body)

      request.get({
        url: uri
      }, function(error, response, body){
        console.log("********** Response ********** \n", body)
        res.send(body)
      })
    })
    .catch(err => {
      queries.logError("HERC: Failed to authenticate token", err)
      return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    })

}

function getNormalTransactions(req, res, next) {
  /*
  ([BETA] Returned 'isError' values: 0=No Error, 1=Got Error)
  (Returns up to a maximum of the last 10000 transactions only)

  Sample block:
  { blockNumber: '6451971',
       timeStamp: '1538658458',
       hash: '0xce1970a7624dcfbbde1f5b2a06a89b53d0a0b65156cbebe07cce6fe1177a659f',
       nonce: '3',
       blockHash: '0xf3b3321cdace26923fd00d573ab481b1da0bc66a90bacddfd434248b54e4d47b',
       transactionIndex: '16',
       from: '0x75fe0f54c65ca39c23d82eb1bada90e4af99a39e',
       to: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
       value: '10000000000000000',
       gas: '21000',
       gasPrice: '41000000000',
       isError: '0',
       txreceipt_status: '1',
       input: '0x',
       contractAddress: '',
       cumulativeGasUsed: '502068',
       gasUsed: '21000',
       confirmations: '561132' }
  */
  var token = req.headers['authorization'];
  if (!token) return res.status(401).send({
    auth: false,
    message: 'No token provided.'
  });
  firebase.auth().signInWithCustomToken(token)
    .then(user_login => {
      try {
        let address = JSON.parse(Object.keys(req.body)[0]) // pass 0x address here
      } catch (err) {
        queries.logError("HERC: Invalid JSON, possible malicious code", err) /*TODO: must error out elegantly for end user */
      }
      var body = {
        module: 'account',
        action: 'txlist',
        address: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
        // startblock: 0,
        // endblock: 99999999,
        apikey: ETHERSCAN_API_KEY
      }

      var uri = 'https://api.etherscan.io/api'
      + '?' + qs.stringify(body)
      let acceptedKeys = ['blockNumber', 'timeStamp', 'hash', 'blockHash', 'from', 'to', 'value', 'isError']

      request.get({
        url: uri
      }, function(error, response, body){
        console.log("********** Response ********** \n", JSON.parse(body))
        var parsedBody = JSON.parse(body)
        var results = parsedBody['result']
        res.send(results)//sending entire response. Optional: clean up before sending

      })
    })
    .catch(err => {
      queries.logError("HERC: Failed to authenticate token", err)
      return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    })


}

function getInternalTransactions(req, res, next) {
  var token = req.headers['authorization'];
  if (!token) return res.status(401).send({
    auth: false,
    message: 'No token provided.'
  });
  firebase.auth().signInWithCustomToken(token)
    .then(user_login => {
      try {
        let address = JSON.parse(Object.keys(req.body)[0]) // pass 0x address here
      } catch (err) {
        queries.logError("HERC: Invalid JSON, possible malicious code", err) /*TODO: must error out elegantly for end user */
      }
      /*
      ([BETA] Returned 'isError' values: 0=No Error, 1=Got Error)
      (Returns up to a maximum of the last 10000 transactions only)
      */
      var body = {
        module: 'account',
        action: 'txlistinternal',
        address: address,
        // startblock: 0,
        // endblock: 99999999,
        apikey: ETHERSCAN_API_KEY
      }

      var uri = 'https://api.etherscan.io/api'
      + '?' + qs.stringify(body)

      request.get({
        url: uri
      }, function(error, response, body){
        let acceptedKeys = ['blockNumber', 'timeStamp', 'hash', 'from', 'to', 'value']
        let results = JSON.parse(body)
        if (results['status'] === '1') {
          console.log("********** Response ********** \n", results['result']) //an array of blocks
          res.send(results)//sending entire response. Optional: clean up before sending
        }
      })
    })
    .catch(err => {
      queries.logError("HERC: Failed to authenticate token", err)
      return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    })


}


module.exports = {
  getEtherBalance: getEtherBalance,
  getNormalTransactions: getNormalTransactions,
  getInternalTransactions: getInternalTransactions
}
