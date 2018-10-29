const rp = require('request-promise');


exports.cryptoCompare = async function() {
    console.log("START GETTING CRYPTO COMPARE") ;
    var jsonRes = {};
    try{
        var options = {
            method: 'GET',  
            uri:  process.env.CRYPTO_COMPARE_URL,
            json : true 
        };     
        
        await rp(options)
        .then(function (resp) {
            console.log("SUCCESS GETTING REQUEST IN CRYPTO COMPARE");
            jsonRes = {
                status: "success",
                message: "Success Getting Crypto Compare",
                result : resp
            };
        })
        .catch(function (err) {
            console.log("ERRROR GETTING REQUEST IN CRYPTO COMPARE");
            jsonRes = {
                status: "error",
                message : err.message
            };
        });
    } catch(error) {
        console.log("ERRROR GETTING REQUEST IN CRYPTO COMPAREl===============" + error);
        jsonRes = {
            status: "error",
            message : error
        };
    }
    
    
    return  jsonRes;
    
}