var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Request = require('request');
const var_dump = require('var_dump');
var Chart = require('chart.js');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GST Calculator' });
});

router.post('/items', function (req, res) {
  res.render('items', { title: 'Items', count: req.body.numbers})
});

router.post('/result', function(request, respond, next) {
  var rbody = request.body;
  var count = rbody.count;
  var str = '{ "expr": [';
  var count5 = 0, count12 = 0, count18 = 0, count28 = 0;
  for (var i = 1; i <= count; i++) {
    var item = "item"+i;
    var price = "price"+i;
    var slab = "slab"+i;
    var sum = "sum"+i;
    var total = "total"+i;
    console.dir(rbody[item]);
    console.dir(rbody[price]);
    console.dir(rbody[slab]);
    str = str+'"'+sum+' = '+rbody[price]+' * '+rbody[slab]+'/100","'+total+' = '+sum+' + '+rbody[price]+'",';
    if (rbody[slab] == 5) {
      count5++;
    } else if (rbody[slab] == 12) {
      count12++;
    } else if (rbody[slab] == 18) {
      count18++;
    } else if (rbody[slab] == 28) {
      count28++;
    }
  }
  var tstr = '"total = 0';
  for (var i = 1; i <= count; i++) {
    var total = 'total'+i;
    tstr = tstr+' + '+total;
  }
  str = str+tstr+'"], "precision": 14}';
  console.dir(count5);
  console.dir(count12);
  console.dir(count18);
  console.dir(count28);
  console.dir(str);
  var cd = [count5/count*100, count12/count*100, count18/count*100, count28/count*100];
  console.dir(cd);

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
      respond.render('display', { title: 'Result', ubody: ubody.result, rbody: rbody, chartdata: cd})
  })
});

module.exports = router;
