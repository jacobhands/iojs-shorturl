var convict = require('convict');

// define a schema

var conf = convict({
    configs: {
        doc: 'Config file(s) to use',
        format: Array,
        default: ['./config.json', './urls.json']
    },
    server: {
        doc: 'Server settings',
        env: {
            doc: 'The applicaton environment.',
            format: ['production', 'development', 'test'],
            default: 'development',
            env: 'NODE_ENV'
        },
        ip: {
            doc: 'The IP address to bind.',
            format: 'ipaddress',
            default: '127.0.0.1',
            env: 'IP_ADDRESS'
        },
        port: {
            doc: 'The port to bind.',
            format: 'port',
            default: 3000,
            env: 'PORT'
        },
        uid: {
            doc: 'uid of process',
            default: null
        },
        gid: {
            doc: 'gid of process',
            default: null
        },
        host: {
            doc: 'host to listen on',
            default: 'localhost'
        }
    },
    options: {
        doc: 'Options for shortener related things.',

        defaultKey: 'index',
        defaultHost: 'default',
        useDefaultHost: {
            doc: 'Use \'default\' host if not found in requested host',
            default: true
        },
        useDefaultKey: {
            doc: 'If no match is found, \'index\' will be used if available.',
            default: false
        },

        root: {
            doc: 'Redirection settings for root requests (eg. example.com/)',
            useDefaultHost: {
                doc: 'Use \'default\' host if not found in requested host',
                default: true
            },
            useDefaultKey: {
                doc: 'If no match is found, \'index\' will be used if available.',
                default: false
            }
        },

        urlList: {
            doc: 'Allows the full list of shortened urls to be requested via browser.',
            enabled: true,
            path: '_'
        },
        aliasPrefix: "alias"
    },
    urls: {
        doc: 'URL\'s to be shortened',
        default: {
            'default': {}
            ,
            format: Object
        }
    }
});

// load environment dependent configuration

var env = conf.get('server.env');

conf.loadFile(conf.get('configs'));

// perform validation

conf.validate();

module.exports = conf;