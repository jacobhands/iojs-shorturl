var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next){
    console.log(req, + ' @ ' + Date.now());
    next();
});
router.get('/', function(req, res){

});

module.exports = router;