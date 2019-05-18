var Web3 = require('web3');
web3 = new Web3(process.env.ROBOT_THUNDERCORE_TESTNET);
let address = '0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc'
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
    })
    .catch(err => {
      console.log('uh oh', err);
    })
}

function getAccounts(req, res, next) {
  let accounts = web3.eth.getAccounts().then(accounts => {
      res.send(accounts)
    })
    .catch(err => {
      console.log(err)
    })
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



function addValidatedTransaction(req, res, next) {
  // TODO: add variables
  ACF.methods.addValidatedTransaction().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function assetAccounts(req, res, next) {
  // TODO: add variables
  ACF.methods.countAssets().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function countAssets(req, res, next) {
  ACF.methods.countAssets().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function countOriginTrans(req, res, next) {
  ACF.methods.countOriginTrans().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function countRecipientTrans(req, res, next) {
  ACF.methods.countRecipientTrans().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function countValidatedTrans(req, res, next) {
  ACF.methods.countValidatedTrans().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function getAllOriginTrans(req, res, next) {
  ACF.methods.getAllOriginTrans().call()
    .then(results => {
      // should return an array of addresses
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function getAllRecipientTrans(req, res, next) {
  ACF.methods.getAllRecipientTrans().call()
    .then(results => {
      // should return an array of addresses
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

function getAsset(req, res, next) {
  let address = '0x942fe152331e6ca69656ee4feaeb8241829a978a'
  ACF.methods.getAsset(address).call()
    .then(results => {
      // should return a single hercId
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function getAssets(req, res, next) {
  ACF.methods.getAssets().call()
    // should return array of address
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function getSingleOriginTrans(req, res, next) {
  let address = '0x942fe152331e6ca69656ee4feaeb8241829a978a'
  ACF.methods.getSingleOriginTrans(address).call()
    .then(results => {
      // should return single hercId
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function getSingleRecipientTrans(req, res, next) {
  let address = '0x942fe152331e6ca69656ee4feaeb8241829a978a'
  ACF.methods.getSingleRecipientTrans(address).call()
    .then(results => {
      // should return single hercId
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function getSingleValidatedTrans(req, res, next) {
  let address = '0x942fe152331e6ca69656ee4feaeb8241829a978a'
  ACF.methods.getSingleValidatedTrans(address).call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function hercContract(req, res, next) {
  ACF.methods.hercContract().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function newOrigTrans(req, res, next) {
  // TODO add variables
  // NOTE doesnt return anything
  ACF.methods.newOrigTrans().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function newRecipTrans(req, res, next) {
  // TODO add variables
  // NOTE doesnt return anything
  ACF.methods.newRecipTrans().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function origTransAccounts(req, res, next) {
  // TODO add variable
  ACF.methods.origTransAccounts().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function owner(req, res, next) {
  ACF.methods.owner().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}


function recipTransAccounts(req, res, next) {
  // TODO add variable
  ACF.methods.recipTransAccounts().call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function registerNewAsset(req, res, next) {
  // NOTE: doesnt return anything
  // TODO: add variables
  ACF.methods.registerNewAsset('megatron', '0x942fe152331e6ca69656ee4feaeb8241829a978a', 12, 334).call()
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
    })
}

function validatedTransAccounts(req, res, next) {
  // TODO add variable
  ACF.methods.validatedTransAccounts().call()
    .then(results => {
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
  getAccounts: getAccounts,
  sendToContract: sendToContract,
  registerNewAsset: registerNewAsset,
  getAssets: getAssets,
  countAssets: countAssets,
  robots: robots
}
