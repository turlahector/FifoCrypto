const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const routesController = require('../controllers/routes-controller');

router.post('/createAccount', routesController.createAccount);
router.get('/getUserDetailsByEmail?:email', routesController.getUserDetailsByEmail);
router.post('/exchange', routesController.tranferEther);
router.post('/walletToWallet', routesController.walletToWalletTransfer);
router.get('/getEtherBalance?:email', routesController.getEtherBalance);
router.post('/login', routesController.login);
//router.post('/createWallet', routesController.createWallet);
router.get('/paypalToken', routesController.paypalToken);
router.post('/createPayment', routesController.createPayment);
router.post('/executePayment', routesController.executePayment);

router.post('/createPayout', routesController.createPayout);

router.get('/checkUSDTOETHER', routesController.USDTOETHER);
module.exports = router;