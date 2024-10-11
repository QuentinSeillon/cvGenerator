const router = require('express').Router();
const cvController = require('./../controllers/cvController');

router.post('/create', cvController.createCv);

module.exports = router;
