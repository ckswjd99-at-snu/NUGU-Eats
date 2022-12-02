var express = require('express');
var router = express.Router()

router.post('/Response.Restaurant', (req, res) => {
  console.log(req)
  res.send({
    'hi': 'hello'
  })
})