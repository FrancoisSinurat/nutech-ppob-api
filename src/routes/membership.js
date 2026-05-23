const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/membershipController');

router.post('/registration', ctrl.register);
router.post('/login', ctrl.login);
router.get('/profile', authenticate, ctrl.getProfile);
router.put('/profile/update', authenticate, ctrl.updateProfile);
router.put('/profile/image', authenticate, upload.single('file'), ctrl.updateProfileImage);

module.exports = router;
