// var express = require('express');
var config = require('./config');
var convict = require('convict');
var urls = convict(config.get('urls'));

var urldb = {
    get: function (req, callback) {
        var key = req.path.replace(/(^\/)/, '');
        var defaultKey = config.get('options').defaultKey;
        var host = req.hostname;
        var defaultHost = config.get('options').defaultHost;
        if (key) {
            if (!urls.has(host + '.' + key)) {
                if (config.get('options').useDefaultHost) {
                    if (!urls.has(defaultHost + '.' + key)) {
                        if (config.get('options').useDefaultKey) {
                            if (!urls.has(host + '.' + defaultKey)) {
                                if (!urls.has(defaultHost + '.' + defaultKey)) {
                                    return callback('Error: can not find: ' + key + ' on host: ' + host +
                                    ' and neither defaultHost or defaultKey resolve.');
                                }
                                else {
                                    host = defaultHost;
                                    key = defaultKey;
                                }
                            }
                            else {
                                key = defaultKey;
                            }
                        }
                        else {
                            return callback('Error: can not find: ' + key + ' on host: ' + host +
                            ' and useDefaultKey is set to false.');
                        }
                    }
                    else {
                        host = defaultHost;
                    }
                }
                else if (config.get('options').useDefaultKey) {
                    if (!urls.has(host + '.' + defaultKey)) {
                        return callback('Error: can not find: ' + key + ' on host: ' + host +
                        ' and useDefaultHost is disabled.');
                    }
                    else {
                        key = defaultKey;
                    }
                }
                else {
                    return callback('Error: can not find: ' + key + ' on host: ' + host +
                    ' and useDefaultHost && useDefaultKey are both disabled.');
                }
            }
        } else {
            // Page requested on root
            if (!urls.has(host)) {
                if (config.get('options').root.useDefaultHost) {
                    host = config.get('options').defaultHost;
                }
                else {
                    return callback('Error: host not found: ' + host + ' and root.useDefaultHost is disabled.');
                }
            }
            if (!urls.has(host + '.' + key)) {
                if (config.get('options').root.useDefaultKey) {
                    key = config.get('options').defaultKey;
                }
                else {
                    return callback('Error: key not found: ' + key + ' on host: '
                    + host + ' and root.useDefaultKey is disabled.');
                }
            }
        }
        resolveUrl(host, key, function (err, url) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(null, url);
            }
        });
    }
};

var aliasRegex = new RegExp(config.get('options').aliasPrefix + ':');
function resolveUrl(host, key, callback) {
    var url;
    resolveAlias(host, key, function (err, host, key) {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, config.get('urls')[host][key]);
        }
    });
}

function resolveAlias(host, key, callback) {
    resolveKey(host, key, function (err, host, key) {
        if (err) {
            return callback(err);
        }
        var url = config.get('urls')[host][key];
        if (aliasRegex.test(url)) {
            key = url.replace(aliasRegex, '');
            resolveAlias(host, key, function (err, h, k) {
                if (err) {
                    return callback(err);
                }
                else {
                    callback(null, h, k);
                }
            });
        }
        else {
            return callback(null, host, key);
        }
    });

}
function resolveHost(host, callback) {
    if (urls.has(host)) {
        return callback(null, host);
    }
    else if (config.get('options').useDefaultHost) {
        return callback(null, config.get('options').defaultHost);
    }
    else {
        return callback('Error: No such host: ' + host + ' and defaultHost is disabled');
    }
}
function resolveKey(host, key, callback) {
    resolveHost(host, function (err, host) {
        if (err) {
            return callback(err);
        }
        // console.log(config.get('urls')[host][key]);
        if (config.has('urls.' + host + '.' + key)) {
            return callback(null, host, key);
        }
        else if (config.get('options').useDefaultKey) {
            return callback(null, host, config.get('options').defaultKey);
        }
        else {
            return callback('Error: No such key: ' + key + ' on host: ' + host + ' and defaultKey is disabled');
        }

    });
}
module.exports = urldb;