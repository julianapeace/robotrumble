var Web3 = require('web3');
web3 = new Web3('https://testnet-rpc.thundercore.com:8544');
let address = '0xfa5b6432308d45b54a1ce1373513fab77166436f'
let ABI=[
  {
    "constant": false,
    "inputs": [
      {
        "name": "b",
        "type": "bool"
      }
    ],
    "name": "BetOnRobot",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "r",
        "type": "uint256"
      }
    ],
    "name": "EndGame",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "g",
        "type": "uint256"
      }
    ],
    "name": "GetWinnings",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "startGame",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_gameInterval",
        "type": "uint256"
      },
      {
        "name": "minBet",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "game",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "winner",
        "type": "uint256"
      }
    ],
    "name": "GameEnded",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "currentGame",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "GameInterval",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "minimumBet",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "g",
        "type": "uint256"
      }
    ],
    "name": "returnBetData",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
let ACF = new web3.eth.Contract(ABI, address) //instantiating

function robots(req, res, next) {
  ACF.methods.GameInterval().call()
    .then(response => {
      console.log('jm contract response:', response);
      res.send(response)
    })
    .catch(err => {
      console.log('uh oh', err);
      res.send(err)
    })
}

function getAccount(req, res, next) {
  var address = req.query.address
  console.log('jm address?', address);
  // let accounts = web3.eth.getAccounts().then(accounts => {
  //     res.send(accounts)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
}

/**
 *
 * @param {*} req json form payload objects
 * @param {*} res orgNameToHex, hercId, factomAddress
 */


function sendToContract(req, res, next) {
  const orgNameToHex = web3.utils.toHex(JSON.stringify(req.body.orgName));
  const factomAddress = '0x4aa66fb0a816657dc882';
  const hercId = parseInt(req.body.hercId);

  if (hercId < 0){  //validate hercId
    return res.send({error: 'hercId is a negative number!'});
  }

  const data = ACF.methods.registerNewAsset(orgNameToHex, hercId, factomAddress).encodeABI(); //converts everything to byte code
  let tx = {
    from: process.env.ETH_PUBLIC_KEY,
    to: address,
    data,
    gasPrice: web3.utils.toWei('2','gwei')  //set initial gasPrice willing to be paid, but this is not necessary.
  };
  ACF.methods.registerNewAsset(orgNameToHex, hercId, factomAddress).estimateGas()
  .then((gas) => { //gets an estimate of gas required to send the transaction
    tx.gas = gas; //set the max amount of gas willing to be paid for this transaction
    return web3.eth.getGasPrice()  //Returns the current gas price. The gas price is determined by the last few blocks median gas price.
  })
  .then((gasPrice) => {
    tx.gasPrice = gasPrice; //set the transaction gas price
    return web3.eth.accounts.signTransaction(tx, process.env.ETH_PRIVATE_KEY); //sign transaction with private key
  })
  .then(transaction => web3.eth.sendSignedTransaction(transaction.rawTransaction)) //this will return a raw transaction
  .then((receipt) => {
    console.log(receipt);
  })
  .catch((err) => {
    console.log(err);
  });
}

function balanceOf(req, res, next) {
  web3.eth.getBalance("0x942fe152331e6ca69656ee4feaeb8241829a978a").call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}


function getAllValidatedTrans(req, res, next) {
  ACF.methods.getAllValidatedTrans().call()
    .then(results => {
      // should return array of address
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}


function getLatestBlock(req, res, next) {
  web3.eth.getBlock("latest", (err, block) => {
    if (err) return;
    res.send(block)
  })
}

module.exports = {
  getLatestBlock: getLatestBlock,
  balanceOf: balanceOf,
  sendToContract: sendToContract,
  getAccount: getAccount,
  robots: robots
}
