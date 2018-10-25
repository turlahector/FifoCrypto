const mysql = require('mysql');
const web3Util = require('../utilities/web3Util');
const MYSQLUtil = require('../utilities/mysqlUtil');


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
                        var column = "LastName, FirstName,EmailAddress,PublicAddress,PrivateAddress,password"
                        var values = "'"+req.body.lastName+"', '"+req.body.firstName+"', '"+req.body.email+"', '"+wallet.result.publicAddress+"', '"+wallet.result.privateAddress+"','"+req.body.password+"'";
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

exports.getUserDetailsByEmail = async (req, res, next) => {
        try{
                console.log(req.params.email);
                var sql = await MYSQLUtil.getUserDetailsByEmail(req.params.email) 
                res.status(200).json(sql);
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

exports.getEtherBalance = async (req, res, next) => {
        try{
                const transaction = await web3Util.getEtherBalance(req.params.email)
                res.status(200).json(transaction);
                
        }catch(error){
                res.status(401).json({"status": "error","message" : error});
        }
}

