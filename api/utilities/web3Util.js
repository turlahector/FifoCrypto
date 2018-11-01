const Web3js = require('web3');
const web3 = new Web3js();
const MYSQLUtil = require('../utilities/mysqlUtil')
const cryptoCompareUtil = require('../utilities/cryptoCompareUtil');

var Tx = require("ethereumjs-tx"); 

const STANDARD_ERC20_ABI = [{"anonymous": false,"inputs": [{"indexed": true,"name": "from","type": "address"},{"indexed": false,"name": "value","type": "uint256"}],"name": "Burn","type": "event"},
{"constant": false,"inputs": [{"name": "_spender","type": "address"},{"name": "_value","type": "uint256"}],"name": "approve","outputs": [{"name": "success","type": "bool"}],
"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_spender","type": "address"},{"name": "_value","type": "uint256"},
  {"name": "_extraData","type": "bytes"}],"name": "approveAndCall","outputs": [{"name": "success","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"
},{"constant": false,"inputs": [{"name": "_value","type": "uint256"}],"name": "burn","outputs": [{"name": "success","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},
{"anonymous": false,"inputs": [{"indexed": true,"name": "from","type": "address"},{"indexed": true,"name": "to","type": "address"}, {"indexed": false,"name": "value", "type": "uint256" }],
"name": "Transfer","type": "event"},{"constant": false,"inputs": [{"name": "_from","type": "address"},{"name": "_value","type": "uint256"}],"name": "burnFrom","outputs": [{"name": "success",
	"type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_to","type": "address"},{"name": "_value","type": "uint256"
  }],"name": "transfer","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_from","type": "address"},{
	"name": "_to","type": "address"},{"name": "_value","type": "uint256"}],"name": "transferFrom","outputs": [{"name": "success","type": "bool"}],"payable": false,"stateMutability": "nonpayable", "type": "function"
},{"inputs": [{"name": "initialSupply","type": "uint256"},{"name": "tokenName","type": "string"},{"name": "tokenSymbol","type": "string"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"
},{"constant": true,"inputs": [{"name": "","type": "address"},{"name": "","type": "address"}],"name": "allowance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view",
"type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "balanceOf","outputs": [ {"name": "", "type": "uint256" }],"payable": false,"stateMutability": "view","type": "function"
},{"constant": true,"inputs": [],"name": "decimals","outputs": [{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "name",
"outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "symbol","outputs": [ {"name": "","type": "string"}],
"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "totalSupply","outputs": [{"name": "","type": "uint256" }],"payable": false,"stateMutability": "view",
"type": "function"}]

web3.setProvider(new web3.providers.HttpProvider(process.env.ETHEREUM_SERVER));

exports.createWallet =  async function(){
    let jsonRes = {};
    try{
        const ethAccount = web3.eth.accounts.create()
        const ethPublicAddress = ethAccount.address;
        const ethPrivateAddress = ethAccount.privateKey

        jsonRes =  {
            status : "success",
            message : "Successfully Created wallet",
            result : {
                publicAddress : ethPublicAddress,
                privateAddress : ethPrivateAddress
            } 
        }
     } catch(err) {
        jsonRes = {
            status : "error",
            message : err.message
        };   
     }
    
    return jsonRes;
}


//exchange ether
exports.sendEther =  async function(params){
    let jsonRes = {};
    try{
        const walletTo = await MYSQLUtil.getUserDetailsByEmail(params.email);
        const cryptoValue = await cryptoCompareUtil.cryptoCompare();
        var data = params;
        var tokenVal = data.amount / cryptoValue.result.USD; 
        
        var trans = {
            "from" : "0x367B257304E85dA318897336249Cb05354F9107A",
            "to" : walletTo.result[0].PublicAddress,
            "amount" : parseFloat(tokenVal)
        }
        var address =  "0x367B257304E85dA318897336249Cb05354F9107A" //currentUSERAdd
        var pass =   "0xC653EF8C37D170ACEAF2EB3A5CE63934422A1223F1CB20E7D587B8D789A61D09" //currentUSERPriv

        
        var transactionDetails = await web3.eth.accounts.signTransaction({
            from: address
            , to: trans.to
            , value: web3.utils.toWei(trans.amount.toString())
            ,"gas": 300000,
            "gasPrice": 300000,
            data : ""
          },pass)

          var sendTransaction =  await web3.eth.sendSignedTransaction(transactionDetails.rawTransaction);
          var trans =  await web3.eth.getTransactionReceipt(sendTransaction.transactionHash)
          var transactionstr = await web3.eth.getTransaction(trans.transactionHash)
          jsonRes = {"status": "success", "message": "Successfully Transfered Ether", "result" : transactionstr }
     } catch(err) {
        jsonRes = {
            status : "error",
            message : err.message
        };   
     }
    
    return jsonRes;
}

//wallet to wallet transfer
exports.walletToWalletTransfer =  async function(params){
    let jsonRes = {};
    try{
        
        
        if(this.isValidEmail(params.from)) {
            walletFrom = await MYSQLUtil.getUserDetailsByEmail(params.from);
        }else {
            walletFrom = await MYSQLUtil.getUserDetailsByPublicAddress(params.from);
        }

        if(this.isValidEmail(params.to)) {
            walletTo = await MYSQLUtil.getUserDetailsByEmail(params.to);
        }else {
            walletTo = await MYSQLUtil.getUserDetailsByPublicAddress(params.to);
        }
        
        console.log("Sender Public Address =======" + walletFrom.result[0].PublicAddress)
        console.log("Reciever Public Address =======" + walletTo.result[0].PublicAddress)
        if (walletFrom.result.length > 0 && walletTo.result.length) {
            var data = params;
            var trans = {
                "from" : walletFrom.result[0].PublicAddress,
                "to" : walletTo.result[0].PublicAddress,
                "amount" : parseFloat(data.amount)
            }
            var address =  walletFrom.result[0].PublicAddress //currentUSERAdd
            var pass =   walletFrom.result[0].PrivateAddress //currentUSERPriv

            
            var transactionDetails = await web3.eth.accounts.signTransaction({
                from: address
                , to: trans.to
                , value: web3.utils.toWei(trans.amount.toString())
                ,"gas": 300000,
                "gasPrice": 300000,
                data : ""
            },pass)

            var sendTransaction =  await web3.eth.sendSignedTransaction(transactionDetails.rawTransaction);
            var trans =  await web3.eth.getTransactionReceipt(sendTransaction.transactionHash)
            var transactionstr = await web3.eth.getTransaction(trans.transactionHash)
            jsonRes = {"status": "success", "message": "Successfully Transfered Ether", "result" : transactionstr }
        } else {
            jsonRes = {
                status : "error",
                message : "Send or Reciever email not found"
            };   
        }
        
     } catch(err) {
        jsonRes = {
            status : "error",
            message : err.message
        };   
     }
    
    return jsonRes;
}


exports.getEtherBalance =  async function(params){
    let jsonRes = {};
    console.log(params)
    const wallet = await MYSQLUtil.getUserDetailsByEmail(params);
    try{
        const res = await web3.eth.getBalance(wallet.result[0].PublicAddress);
        jsonRes =  {
            status : "success",
            message : "Successfully get Ether Balance",
            result : {
                address : params,
                symbol : "Ether",
                ether : web3.utils.fromWei(res,"ether")
            }
        }
     } catch(err) {
        jsonRes = {
            status : "error",
            message : err.message
        };    
     }
    
    return jsonRes;
}

exports.isValidEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}