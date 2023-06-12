var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/welcome/:name', function (req, res, next) {
  // req.query = query parameters
  // req.params = route parameters
  let exclam = '!'
  let query = req.query.id
  res.send(`help ${req.params.name} ${exclam} avec l'id ${query} `);
});

module.exports = router;
