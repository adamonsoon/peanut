var express = require('express');
var router = express.Router();

const dependencies = require('../models/dependencies.js');
const cache = require('../models/cache.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Peanut', bodyClass: 'index-page' });
});

// GET package JSON
router.get('/:package/json', function(req, res, next) {
  
  var depTree = {},
      depCount = { count: 0 },
      packageName = req.params.package;
  
  cache.get(packageName).then(function(cached) {
    
    if (cached !== null) {
      depTree = JSON.parse(cached);
      res.status('packages').send({ title: packageName, tree: depTree });
    } else {
      dependencies.get(packageName, depTree, 20, depCount)
        .then(function() {
          depTree.__count = depCount.count;
          res.status('packages').send({ title: packageName, tree: depTree });
          cache.set(packageName, depTree);
        });
    }
  });
});

module.exports = router;
