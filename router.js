var express = require('express');
var router = express.Router();
var urldb = require('./urldb');
var accesslog = require('access-log');
var config = require('./config');

router.use(function(req, res, next){
    accesslog(req, res);
    next();
});

router.get('/' + config.get('options').urlList.path.replace(/(\/+$)|(^\/+)/g, ''), function (req, res) {
    if (config.get('options').urlList.enabled) {
        res.end(JSON.stringify(config.get('urls'), null, 3));
    }
    else {
        res.end('Error: options.urlList.enabled is set to false. Set to true to allow url listing');
    }
});

router.get('/*', function (req, res) {
    urldb.get(req, function (err, url) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect(url);
        }
    })
});

module.exports = router;