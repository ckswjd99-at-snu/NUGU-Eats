var express = require('express');
var router = express.Router();
var restaurantData = require('../data/restaurant')
console.log(restaurantData)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/health', (req, res) => {
  res.send('OK')
})


router.post('/Response.Restaurant', (req, res) => {
  let requestedCategory = req.body.action.parameters?.food_category.value
  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }

  response.output.restaurant_list = restaurantData.filter(
    row => row.category == requestedCategory
  ).map(
    row => row.name
  ).join(', ')
  
  res.send(response)
})

router.post('/Response.RestaurantInfo', (req, res) => {
  let requestedRestaurant = req.body.action.parameters?.restaurant_name.value
  let requestedInfo = req.body.action.parameters?.restaurant_info.value
  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }

  const findRestaurant = restaurantData.find(row => row.name == requestedRestaurant)
  if (!findRestaurant) {
    response.resultCode = "no_such_restaurant"
  }
  // response.output.restaurant_list = 
  
  res.send(response)
})

module.exports = router;
