var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/health', (req, res) => {
  res.send('OK')
})


router.post('/Response.Restaurant', (req, res) => {
  let requestedCategory = ''
  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }
  if (requestedCategory = req.body.action.parameters?.food_category.value) {
    switch (requestedCategory) {
      case '한식': {
        response.output.restaurant_list = '엄마손칼국수, 기절초풍왕순대'
        break;
      }
      case '양식': {
        response.output.restaurant_list = '오른손 푸드카페'
        break;
      }
      case '일식': {
        response.output.restaurant_list = '누들하우스'
        break;
      }
      case '중식': {
        response.output.restaurant_list = '흑룡강'
        break;
      }
      case '아시안': {
        response.output.restaurant_list = '딸랏롯빠이'
        break;
      }
      case '분식': {
        response.output.restaurant_list = '동대문 엽기떡볶이'
        break;
      }
      case '비건': {
        response.output.restaurant_list = '샐러드로우'
        break;
      }
    }
  }
  res.send(response)
})

module.exports = router;
