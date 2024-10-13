const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cvController = require('./../controllers/cvController');

router.get('/', cvController.allCv);
router.post('/create', authMiddleware, cvController.createCv);
router.get('/my-cvs', authMiddleware, cvController.cvByUser);
router.put('/update/:id', authMiddleware, cvController.updateCv);
router.put('/update/:id/recommendation', authMiddleware, cvController.recommendationCv);
router.get('/:id', authMiddleware, cvController.getCvById);
router.delete('/delete/:id', authMiddleware, cvController.deleteCv);

module.exports = router;
