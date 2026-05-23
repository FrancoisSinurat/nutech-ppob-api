const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');
const ctrl = require('../controllers/transactionController');

router.use(authenticate);

router.get('/balance', ctrl.getBalance);
router.post('/topup', ctrl.topUp);
router.post('/transaction', ctrl.createTransaction);
router.get('/transaction/history', ctrl.getHistory);

module.exports = router;
