var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/Response.Restaurant', (req, res) => {
  console.log(req)
  res.send({
    'hi': 'hello'
  })
})

module.exports = router;
