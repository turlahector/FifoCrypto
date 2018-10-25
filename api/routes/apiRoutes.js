const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const routesController = require('../controllers/routes-controller');

router.post('/createAccount', routesController.createAccount);
router.get('/getUserDetailsByEmail/:email', routesController.getUserDetailsByEmail);
router.post('/exchange', routesController.tranferEther);
router.post('/walletToWallet', routesController.walletToWalletTransfer);
router.get('/getEtherBalance/:email', routesController.getEtherBalance);
router.post('/login', routesController.login);

module.exports = router;