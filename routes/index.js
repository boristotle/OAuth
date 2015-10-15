var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',{ title: 'Express', user: req.user });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});



module.exports = router;
