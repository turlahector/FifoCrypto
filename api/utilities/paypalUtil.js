const rp = require('request-promise');

exports.requestToken = async function() {
    var jsonRes = {};
    try{
        var options = {
            method: 'POST',  
            uri:  process.env.PAYPAL_ENDPOINT+'oauth2/token',
            auth: {
                'user': process.env.PAYPAL_USERNAME,
                'pass': process.env.PAYPAL_PASSWORD},
            form: {grant_type : "client_credentials"},  
            json : true 
        };     
        
        await rp(options)
        .then(function (resp) {
            jsonRes = {
                status: "success",
                message: "Successfully get AUTH in PAYPAL",
                result : resp
            };
            console.log("SUCCESFULLY TOKEN AUTH CREATED IN PAYPAL");
        })
        .catch(function (err) {
            jsonRes = {
                status: "error",
                message : err.message
            };
        });
    } catch(error) {
        jsonRes = {
            status: "error",
            message : error
        };
    }
    
    
    return  jsonRes;
    
}

exports.createPayment = async function(param) {
    console.log("START CREATING PAYMENT REQUEST") ;
    console.log(param)
    var jsonRes = {};
    try{
        var options = {
            method: 'POST',  
            uri:  process.env.PAYPAL_ENDPOINT+'payments/payment',
            auth: {
                'bearer': param.token},
            body: {
                "intent": "sale",
                "redirect_urls": {
                  "return_url": process.env.RETURN_URL,
                  "cancel_url": process.env.CANCEL_URL
                },
                "payer": {
                  "payment_method": "paypal"
                },
                "transactions": [{
                  "amount": {
                    "total": param.amount,
                    "currency": param.currency
                  }
                }]
              },  
            json : true 
        };     
        
        await rp(options)
        .then(function (resp) {
            console.log("Successfull request in getting payment paypal");
            jsonRes = {
                status: "success",
                message: "Successfully create a payment transaction in PAYPAL",
                result : resp
            };
        })
        .catch(function (err) {
            console.log("ERRROR request in getting payment paypal");
            jsonRes = {
                status: "error",
                message : err.message
            };
        });
    } catch(error) {
        jsonRes = {
            status: "error",
            message : error
        };
    }
    
    
    return  jsonRes;
    
}

exports.executePayment = async function(param) {
    console.log("START EXECUTING PAYMENT REQUEST") ;
    console.log(param)
    var jsonRes = {};
    try{
        var options = {
            method: 'POST',  
            uri:  process.env.PAYPAL_ENDPOINT+'payments/payment/'+params.id+"/execute",
            auth: {
                'bearer': param.token},
            body: {
                "payer_id": param.payerId
            },  
            json : true 
        };     
        
        await rp(options)
        .then(function (resp) {
            console.log("SUCCESS EXECUTING THE PAYMETN in paypal");
            jsonRes = {
                status: "success",
                message: "Payment SUCCESS in PAYPAL",
                result : resp
            };
        })
        .catch(function (err) {
            console.log("ERRROR EXECUTING PAYMENT in paypal");
            jsonRes = {
                status: "error",
                message : err.message
            };
        });
    } catch(error) {
        console.log("ERRROR EXECUTING PAYMENT in paypal===============" + error);
        jsonRes = {
            status: "error",
            message : error
        };
    }
    
    
    return  jsonRes;
    
}