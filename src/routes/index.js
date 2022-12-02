var express = require('express');
var router = express.Router();
var restaurantData = require('../data/restaurant')
// console.log(restaurantData)

let orderRestaurant = ''
let order = {}

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
  console.log(req.body)
  console.log(requestedRestaurant, requestedInfo, findRestaurant)
  if (!findRestaurant) {
    response.resultCode = "no_such_restaurant"
    res.send(response)
    return
  }

  switch(requestedInfo) {
    case "주소": {
      response.output.requested_info = findRestaurant["address"]
      break;
    }
    case "전화번호": {
      response.output.requested_info = findRestaurant["phone"]
      break;
    }
    case "메뉴": {
      response.output.requested_info = findRestaurant["menu"].map(menuobj => `${menuobj.menu_name} ${menuobj.price}원`).join(', ')
      break;
    }
  }
  

  if (!response.output.requested_info) {
    response.resultCode = "no_such_info"
    res.send(response)
    return
  }
  
  res.send(response)
})

router.post('/Response.Order/get_menu', (req, res) => {
  let requestedRestaurant = req.body.action.parameters?.restaurant_order_name.value
  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }

  let findRestaurant = restaurantData.find(row => row.name == requestedRestaurant)
  if (!findRestaurant) {
    response.resultCode = "no_such_restaurant"
    res.send(response)
    return
  }
  
  res.send(response)
})


router.post('/Order.AddMenu', (req, res) => {
  let requestedRestaurant = req.body.action.parameters.order_restaurant?.value
  let requestedMenu = req.body.action.parameters.order_menu?.value
  let requestedCount = req.body.action.parameters.order_count?.value

  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }
  response.output.before_restaurant = orderRestaurant

  if (!requestedRestaurant || !requestedMenu || !requestedCount) {
    response.resultCode = "error"
    res.send(response)
    return
  }

  if (requestedRestaurant != orderRestaurant) {
    response.resultCode = "restaurant_changed"
    res.send(response)
    return
  }

  order[requestedMenu] += parseInt(requestedCount)

  res.send(response)
})

router.post('/Order.Cancel', (req, res) => {

  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }
  
  order = {}
  orderRestaurant = ''

  res.send(response)
})

router.post('/Order.Check', (req, res) => {

  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }
  
  let totalsum = 0

  response.output["order_check_restaurant"] = orderRestaurant
  response.output["order_check_list"] = Object.entries(order).map(([key, value]) => {
    let price = restaurantData.find(r => r.name == orderRestaurant).menu.find(m => m.menu_name == key).price
    let smallsum = price * value
    totalsum += smallsum
    return `${key} ${value}개`
  }).join(', ') + ` 총 ${totalsum}원`

  res.send(response)
})

router.post('/Order.Submit', (req, res) => {

  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }
  
  let totalsum = 0

  response.output["order_submit_list"] = Object.entries(order).map(([key, value]) => {
    let price = restaurantData.find(r => r.name == orderRestaurant).menu.find(m => m.menu_name == key).price
    let smallsum = price * value
    totalsum += smallsum
    return `${key} ${value}개`
  }).join(', ') + ` 총 ${totalsum}원`

  res.send(response)
})

router.post('/order_submit_yes', (req, res) => {

  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }
  
  let totalsum = 0

  response.output["order_submit_list"] = Object.entries(order).map(([key, value]) => {
    let price = restaurantData.find(r => r.name == orderRestaurant).menu.find(m => m.menu_name == key).price
    let smallsum = price * value
    totalsum += smallsum
    return `${key} ${value}개`
  }).join(', ') + ` 총 ${totalsum}원`

  order = {}
  orderRestaurant = ''

  res.send(response)
})

router.post('/order_submit_no', (req, res) => {

  let response = {
    "version": "2.0",
    "resultCode": "OK",
    "output": Object.fromEntries(Object.entries(req.body.action.parameters).map(([key, val]) => [key, val.value]))
  }
  
  let totalsum = 0

  response.output["order_submit_list"] = Object.entries(order).map(([key, value]) => {
    let price = restaurantData.find(r => r.name == orderRestaurant).menu.find(m => m.menu_name == key).price
    let smallsum = price * value
    totalsum += smallsum
    return `${key} ${value}개`
  }).join(', ') + ` 총 ${totalsum}원`

  res.send(response)
})




module.exports = router;
