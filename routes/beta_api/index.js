var express = require('express');
var router = express.Router();

router.use('/host', require('./host'));

module.exports = router;
