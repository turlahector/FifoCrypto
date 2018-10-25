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

