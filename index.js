var express = require('express');
var router = require('./router');
var app = express();

var config = require('./config');
app.use('/', router);

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.dir(config.get('urls'));
    if(config.has('gid')) process.setgid(config.get('gid'));
    if(config.has('uid')) process.setuid(config.get('uid'));
    console.log('Listening on http://%s:%s', host, port);
});