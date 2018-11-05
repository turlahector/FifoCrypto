const mysql = require('mysql');
const web3Util = require('../utilities/web3Util');
const MYSQLUtil = require('../utilities/mysqlUtil');
const PayPalUtil = require('../utilities/paypalUtil');
const cryptoCompareUtil = require('../utilities/cryptoCompareUtil');

const con = mysql.createConnection({
        host: "sl-us-south-1-portal.15.dblayer.com",
        user: "admin",
        password: "VMUSWWFVGOZFGYZK",
        database: "dex_eth",
        port: "62534 "
      });
      

exports.createAccount = async (req, res, next) => {
        try{
                var user = await MYSQLUtil.getUserDetailsByEmail(req.body.email);

                if (user.result.length > 0) {
                        res.status(401).json({"status" : "error","message":"Email already exist"});
                }else {
                        const wallet = await web3Util.createWallet();
                        console.log(wallet.result);
                        var column = "LastName, FirstName,EmailAddress,PublicAddress,PrivateAddress,password,paypalEmail"
                        var values = "'"+req.body.lastName+"', '"+req.body.firstName+"', '"+req.body.email+"', '"+wallet.result.publicAddress+"', '"+wallet.result.privateAddress+"','"+req.body.password+"','"+req.body.paypalEmail+"'";
                        var sql = "INSERT INTO user ("+column+") VALUES ("+values+")";

                        con.query(sql, function (err, result) {
                                if (err) throw err;
                                res.status(200).json({"status":"success","message":"Successfully Created","result" : result});
                                console.log("1 record inserted");
                        });
                }
        }catch(error){
                res.status(401).json({status : "error" ,"message" : error});
        }
}

exports.createWallet = async (req, res, next) => {
        try{
                var column = "walletType, walletName,symbol,balance,email,publicAddress,privateAddress"
                var values = "'"+req.body.walletType+"', '"+req.body.walletName+"', '"+req.body.symbol+"', '"+req.body.balance+"', '"+req.body.email+"','"+req.body.publicAddress+"','"+req.body.privateAddress+"'";
                var sql = "INSERT INTO wallet ("+column+") VALUES ("+values+")";

                con.query(sql, function (err, result) {
                        if (err) throw err;
                        res.status(200).json({"status":"success","message":"Successfully Created","result" : result});
                        console.log("1 wallet record inserted");
                });
        }catch(error){
                res.status(401).json({status : "error" ,"message" : error});
        }
}

exports.getUserDetailsByEmail = async (req, res, next) => {
        try{
                console.log(req.params.email);
                var  sql = await MYSQLUtil.getUserDetailsByEmail(req.query.email) 
                var otherWallet = await MYSQLUtil.getWalletByEmail(req.query.email) 
                res.status(200).json({
                        "status" : "success", 
                        "message" : "User Details and Wallet Details", 
                        "result" : {"User" : sql.result,
                                    "Wallet" : otherWallet.result }
                        });
        }catch(error){
                res.status(401).json({"result" : "error"});
        }
}

exports.tranferEther = async (req, res, next) => {
        try{
                const transaction = await web3Util.sendEther(req.body)
                res.status(200).json(transaction);
                
        }catch(error){
                res.status(401).json({status : "error", message : error});
        }
}

exports.walletToWalletTransfer = async (req, res, next) => {
        try{
                const transaction = await web3Util.walletToWalletTransfer(req.body)
                res.status(200).json({"result" : transaction});
                
        }catch(error){
                res.status(401).json({"result" : "error"});
        }
}

exports.login = async (req, res, next) => {
        try{
                console.log(req.body);
                var sql = "SELECT * FROM user where EmailAddress = '"+req.body.email+"' && password = '"+req.body.password+"'";

                con.query(sql, function (err, result) {
                        if (err) throw err;
                        if(result.length > 0) {
                                res.status(200).json({"status" : "success", "message":"Successfully Login", "result": result});
                        }else {
                                res.status(401).json({"status" : "error", "message":"Invalid username"});
                        }
                });
        }catch(error){
                res.status(401).json({"status" : "error", "message":error});
        }
}

exports.paypalToken = async (req, res, next) => {
        try{
                const payPalAuth = await PayPalUtil.requestToken();
                res.status(200).json(payPalAuth);
        }catch(error){
                res.status(401).json({"status" : "error", "message":error});
        }
}

exports.createPayment = async (req, res, next) => {
        try{
                const token = await PayPalUtil.requestToken();
                console.log(token.status);
                if (token.status == "success") {
                        var params = {
                                "amount":req.body.amount,
                                "currency":req.body.currency,
                                "successUrl" : req.body.successUrl,
                                "cancelUrl" : req.body.cancelUrl,
                                "token":token.result.access_token};

                        const payment = await PayPalUtil.createPayment(params);
                        res.status(200).json(payment);
                }else {
                        res.status(401).json(token); 
                }
                
        }catch(error){
                res.status(401).json({"status" : "error", "message":error});
        }
}

exports.buyViaOtherWallet = async (req, res, next) => {
        try{
                const wallet = await MYSQLUtil.getWalletByEmailAndTypeAndSymbol(req.body.email, req.body.walletType, req.body.symbol)
                const adminWallet = await MYSQLUtil.getWalletByEmailAndTypeAndSymbol("admin@email.com", "MAIN", req.body.symbol)
                console.log(wallet.result[0])
                if (wallet.result[0].balance > req.body.amount) {
                        var params = {email : req.body.email, amount : req.body.amount}
                        const transaction = await web3Util.sendEther(params)

                        if(transaction.status == "success") {
                                var finalAmount = parseFloat(wallet.result[0].balance) - parseFloat(req.body.amount); 
                                var finalAmountAdmin = parseFloat(adminWallet.result[0].balance) + parseFloat(req.body.amount); 
                                console.log("finalAmount" + finalAmount);
                                const updatedWallet = await MYSQLUtil.updateWalletAmountById(wallet.result[0].id,finalAmount)
                                const updatedWalletAdmin = await MYSQLUtil.updateWalletAmountById(adminWallet.result[0].id,finalAmountAdmin)
                                res.status(200).json(updatedWallet);
                        } else {
                                res.status(401).json(transaction);
                        }
                }else {
                        res.status(401).json({"status" : "error", "message":"Insufficient Funds"});  
                }
                
        }catch(error){
                res.status(401).json({"status" : "error", "message":error});
        }
}

exports.sellViaOtherWallet = async (req, res, next) => {
        try{
                const wallet = await MYSQLUtil.getWalletByEmailAndTypeAndSymbol(req.body.email, req.body.walletType, req.body.symbol)
                const adminWallet = await MYSQLUtil.getWalletByEmailAndTypeAndSymbol("admin@email.com", "MAIN", req.body.symbol)
                console.log(wallet.result[0])

                if(wallet.result.length > 0 ) {
                        var params = {amount : req.body.amount, from : req.body.email }
                        const transaction = await web3Util.userToAdminTransfer(params)

                        if (transaction.status == "success") {
                                const cryptoValue = await cryptoCompareUtil.cryptoCompare();
                                var usdVal = req.body.amount * cryptoValue.result.USD; 
                                var finalAmount = parseFloat(wallet.result[0].balance) + parseFloat(usdVal); 
                                var adminBalance = parseFloat(adminWallet.result[0].balance) - parseFloat(usdVal); 
                                console.log("finalAmount" + finalAmount)
                                const updatedWallet = await MYSQLUtil.updateWalletAmountById(wallet.result[0].id,finalAmount);
                                const updatedWalletAdmin = await MYSQLUtil.updateWalletAmountById(adminWallet.result[0].id,adminBalance);
                                res.status(200).json(updatedWallet);
                        }else {
                                res.status(401).json(transaction)       
                        }
                        
                } else {
                        res.status(401).json({"status" : "error", "message":"No wallet found"});  
                }
                
        }catch(error){
                res.status(401).json({"status" : "error", "message":error});
        }
}

exports.executePayment = async (req, res, next) => {
        try{
                const token = await PayPalUtil.requestToken();

                var params = {
                         "id":req.body.id,
                        "payerId":req.body.payerId,
                        "token":token.result.access_token};

                const payment = await PayPalUtil.executePayment(params);
                res.status(200).json(payment);
        }catch(error){
                res.status(401).json({"status" : "error", "message":error});
        }
}

exports.createPayout = async (req, res, next) => {
        try{
                const token = await PayPalUtil.requestToken();

                var params = {
                         "value":req.body.value,
                        "receiver":req.body.receiver,
                        "token":token.result.access_token};

                const payoutReq = await PayPalUtil.payouts(params);
                console.log("payoutReq =======" + JSON.stringify(payoutReq.result.batch_header.payout_batch_id));
                if(payoutReq.status == "success") {
                        var paramPayReq = {"token":token.result.access_token,payoutBatchId: payoutReq.result.batch_header.payout_batch_id}
                        const payoutExec = await PayPalUtil.executePayouts(paramPayReq);
                        console.log(payoutExec)
                        if(payoutExec.status == "success") {
                                var paramsTokenTranfer = {from :req.body.from, amount : req.body.value}
                                const transferToken = await web3Util.userToAdminTransfer(paramsTokenTranfer);
                                
                                if (transferToken.status == "success") {
                                        res.status(200).json({
                                                status : "sucess",
                                                message : "Success Payout and Token Transfer",
                                                result :{
                                                        paypalPayout :payoutExec.result,
                                                        ethereumTransaction :transferToken.result
                                                } 
                                        });
                                }else {
                                        res.status(401).json(transferToken); 
                                }
                                
                        }else {
                                res.status(401).json(payoutExec);
                        }
    
                }else {
                        res.status(401).json(payoutReq);
                }
                
        }catch(error){
                res.status(401).json({"status" : "error", "message":error});
        }
}

exports.USDTOETHER = async (req, res, next) => {
        try{

                const cryptoValue = await cryptoCompareUtil.cryptoCompare();
                var ether
                // var params = {
                //          "id":req.body.id,
                //         "payerId":req.body.payerId,
                //         "token":token.result.access_token};

                // const payment = await PayPalUtil.executePayment(params);
                res.status(200).json(cryptoValue);
        }catch(error){
                res.status(401).json({"status" : "error", "message":error});
        }
}

exports.getEtherBalance = async (req, res, next) => {
        try{
                const transaction = await web3Util.getEtherBalance(req.query.email)
                res.status(200).json(transaction);
                
        }catch(error){
                res.status(401).json({"status": "error","message" : error});
        }
}

