var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  return res.json({ test: req.body.foo});
})

module.exports = router
