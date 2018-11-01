const rp = require('request-promise');
const cryptoCompareUtil = require('../utilities/cryptoCompareUtil')

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
                  "return_url": param.successUrl,
                  "cancel_url": param.cancelUrl
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
            uri:  process.env.PAYPAL_ENDPOINT+'payments/payment/'+param.id+"/execute",
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


exports.executePayouts = async function(param) {
    console.log("START EXECUTING PAYOUT REQUEST") ;
    var jsonRes = {};
    try{
        var options = {
            method: 'GET',  
            uri:  process.env.PAYPAL_ENDPOINT+'payments/payouts/'+param.payoutBatchId,
            auth: {
                'bearer': param.token},
            json : true 
        };     
        
        await rp(options)
        .then(function (resp) {
            console.log("SUCCESS EXECUTING THE PAYOUT in paypal");
            jsonRes = {
                status: "success",
                message: "PAYOUT SUCCESS in PAYPAL",
                result : resp
            };
        })
        .catch(function (err) {
            console.log("ERRROR EXECUTING PAYOUT in paypal");
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
    return jsonRes;
}

exports.payouts = async function(param) {
        console.log("START REQUEST PAYOUT REQUEST") ;
        var randomNum = Math.floor((Math.random() * 10000000000000) + 1);
        var jsonRes = {};

        const cryptoValue = await cryptoCompareUtil.cryptoCompare();
        var usdVal = param.value * cryptoValue.result.USD; 

        try{
            var options = {
                method: 'POST',  
                uri:  process.env.PAYPAL_ENDPOINT+'payments/payouts',
                auth: {
                    'bearer': param.token},
                body: {
                    "sender_batch_header": {
                      "sender_batch_id": +randomNum,
                      "email_subject": "GetFIFO Exchange!",
                      "email_message": "You have recieve payout, Thank you for using GETFIFO Exchange!"
                    },
                    "items": [
                      {
                        "recipient_type": "EMAIL",
                        "amount": {
                          "value": usdVal,
                          "currency": "USD"
                        },
                        "note": "Thanks for your patronage!",
                        "sender_item_id": "32432234234",
                        "receiver": param.receiver
                      }
                    ]
                  },  
                json : true 
            };     
            
            await rp(options)
            .then(function (resp) {
                console.log("SUCCESS REQUEST THE PAYOUT in paypal");
                jsonRes = {
                    status: "success",
                    message: "Request Payout SUCCESS in PAYPAL",
                    result : resp
                };
            })
            .catch(function (err) {
                console.log("ERRROR Request Payout in paypal");
                jsonRes = {
                    status: "error",
                    message : err.message
                };
            });
        } catch(error) {
            console.log("ERRROR Request Payout in paypal===============" + error);
            jsonRes = {
                status: "error",
                message : error
            };
        }
    
    
    return  jsonRes;
    
}