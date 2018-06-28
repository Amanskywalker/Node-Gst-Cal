var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Request = require('request');
const var_dump = require('var_dump');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/items', function (req, res) {
  res.render('items', { title: 'Items', count: req.body.numbers})
});

router.post('/result', function(request, respond, next) {
  var rbody = request.body;
  var count = rbody.count;
  var str = '{ "expr": [';
  for (var i = 1; i <= count; i++) {
    var item = "item"+i;
    var price = "price"+i;
    var slab = "slab"+i;
    var sum = "sum"+i;
    var total = "total"+i;
    console.dir(rbody[item]);
    console.dir(rbody[price]);
    console.dir(rbody[slab]);
    str = str+'"'+sum+' = '+rbody[price]+' * '+rbody[slab]+'","'+total+' = '+sum+' + '+rbody[price]+'",';
  }
  str = str+'"s = 1+1"], "precision": 14}';
  console.dir(str);
  Request.post({
    "headers": { "content-type": "application/json"},
    "url": "http://api.mathjs.org/v4/",
    "body": str
  }, (error, response, body) => {
      if(error) {
          return console.dir(error);
      }
      var ubody = JSON.parse(body);
      console.dir(ubody);
      console.dir(rbody);
      respond.render('display', { title: 'Result', ubody: JSON.stringify(ubody.result), rbody: rbody})
  })
});

module.exports = router;
