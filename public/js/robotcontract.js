var Web3 = require('web3');
var web3 = new Web3('https://mainnet-rpc.thundercore.com'); //https://testnet-rpc.thundercore.com:8544
let address = '0x9601422a49f4906c6b2e792af2c76900e546adca' //0x7cb50610e7e107b09acf3fbb8724c6df3f3e1c1d
let ABI = [
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
		"name": "Initialize",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "r",
				"type": "uint256"
			},
			{
				"name": "direction",
				"type": "uint256"
			},
			{
				"name": "speed",
				"type": "uint256"
			}
		],
		"name": "moveRobot",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "n",
				"type": "uint256"
			}
		],
		"name": "setGameInterval",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "a",
				"type": "address"
			}
		],
		"name": "setRobotAddress",
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
			},
			{
				"name": "_MovePrice",
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "robot",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "direction",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "speed",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "mover",
				"type": "address"
			}
		],
		"name": "RobotMoved",
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
		"inputs": [
			{
				"name": "g",
				"type": "uint256"
			}
		],
		"name": "getBetChoice",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "bool"
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
				"name": "",
				"type": "address"
			}
		],
		"name": "isRobot",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastMoveTime",
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
		"inputs": [],
		"name": "MovePrice",
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
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "winningRobot",
		"outputs": [
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
let RobotContract = new web3.eth.Contract(ABI, address)

function GameInterval(req, res, next) {
  RobotContract.methods.GameInterval().call()
    .then(response => {
      res.send(response)
    })
    .catch(err => {
      res.send(err)
    })
}

function betOnRobot(req, res, next) {
  // true = robot1
  // false = robot2
  // e.g. BetOnRobot(true)
  RobotContract.methods.BetOnRobot().send()
    .then(response => {
      res.send(response)
    })
    .catch(err => {
      res.send(err)
    })
}

function startGame(req, res, next) {
  // must be sent from authorized acct.
  RobotContract.methods.startGame().send()
  .then(response => {
    res.send(response)
  })
  .catch(err => {
    res.send(err)
  })
}

function endGame(req, res, next) {
  // int for robot id.
  // endGame(1)
  RobotContract.methods.endGame().send()
  .then(response => {
    res.send(response)
  })
  .catch(err => {
    res.send(err)
  })
}

function GetWinnings(req, res, next) {
  // needs a gameId
  // GetWinnings(gameId)
  RobotContract.methods.GetWinnings().send()
  .then(response => {
    res.send(response)
  })
  .catch(err => {
    res.send(err)
  })
}

function moveRobot() {
  // robotid, direction, speed
  // message.value
  // moveRobot(1, 3, 10)
  RobotContract.methods.moveRobot().send()
  .then(response => {
    res.send(response)
  })
  .catch(err => {
    res.send(err)
  })
}
