const express = require('express')
const router = express.Router();

const cacheAppController = require('../controllers/cache-app.controller');

router.get('/', cacheAppController.findAll);

router.get('/:key', cacheAppController.findOne);

router.get('/keys', cacheAppController.findKeys);

router.put('/', cacheAppController.createCache);

router.delete('/:key', cacheAppController.deleteOne);

router.delete('/', cacheAppController.deleteAll);



module.exports = router;