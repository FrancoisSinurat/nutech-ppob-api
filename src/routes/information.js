const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');
const ctrl = require('../controllers/informationController');

router.get('/banner', ctrl.getBanners);
router.get('/services', authenticate, ctrl.getServices);

module.exports = router;
