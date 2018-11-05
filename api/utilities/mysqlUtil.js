const mysql = require('mysql');
const util = require('util');

const con = mysql.createConnection({
    host: "sl-us-south-1-portal.15.dblayer.com",
    user: "admin",
    password: "VMUSWWFVGOZFGYZK",
    database: "dex_eth",
    port: "62534 "
  });

const query = util.promisify(con.query).bind(con);

exports.getUserDetailsByEmail =  async function(email){
    var resp = {};
    try{
        var sql = "SELECT * FROM user where EmailAddress = '"+email+"'";
        var sqlres = await query(sql);
        return resp = {"status": "success" , "message":"User Details", "result" : sqlres};
        
    }catch(error){
        return resp = {"status": "error" , "message":error};
    }
}

exports.getWalletByEmail =  async function(email){
    var resp = {};
    try{
        var sql = "SELECT * FROM wallet where email = '"+email+"'";
        var sqlres = await query(sql);
        return resp = {"status": "success" , "message":"Wallet Details", "result" : sqlres};
        
    }catch(error){
        return resp = {"status": "error" , "message":error};
    }
}

exports.getWalletByEmailAndTypeAndSymbol =  async function(email,walletType,symbol){
    var resp = {};
    try{
        var sql = "SELECT * FROM wallet where email = '"+email+"' && walletType = '"+walletType+"' && symbol = '"+symbol+"'";
        var sqlres = await query(sql);
        return resp = {"status": "success" , "message":"Wallet Details", "result" : sqlres};
        
    }catch(error){
        return resp = {"status": "error" , "message":error};
    }
}

exports.updateWalletAmountById =  async function(id,amount){
    var resp = {};
    try{
        var sql = "UPDATE wallet set balance = '"+amount+"' where id = "+id+";";
        var sqlres = await query(sql);
        return resp = {"status": "success" , "message":"Updated Successfully", "result" : sqlres};
        
    }catch(error){
        return resp = {"status": "error" , "message":error};
    }
}


exports.getUserDetailsByPublicAddress =  async function(address){
    var resp = {};
    try{
        var sql = "SELECT * FROM user where PublicAddress = '"+address+"'";
        var sqlres = await query(sql);
        return resp = {"status": "success" , "message":"User Details", "result" : sqlres};
        
    }catch(error){
        return resp = {"status": "error" , "message":error};
    }
}

