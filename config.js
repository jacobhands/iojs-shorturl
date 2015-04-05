var convict = require('convict');

// define a schema

var conf = convict({
        config: {
            doc: 'Config file(s) to use',
            format: Array,
            default: []
        },
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
        },
        options: {
            doc: 'Options for shortener related things.',
            default: {
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

                hostRoot: {
                    doc: 'Redirection settings for root requests (eg. example.com/)',
                    default: {
                        useDefaultHost: {
                            doc: 'Use \'default\' host if not found in requested host',
                            default: true
                        },
                        useDefaultKey: {
                            doc: 'If no match is found, \'index\' will be used if available.',
                            default: false
                        }
                    }
                },
                urlList: {
                    doc: 'Allows the full list of shortened urls to be requested via browser.',
                    default: {
                        enabled: true,
                        path: {
                            doc: 'The path to get the list of URL\'s (eg. example.com/_',
                            default: '_'
                        }
                    }
                },
                alias: {
                    doc: 'Aliases allow multiple entries to point to a single URL (eg. alias:google)',
                    default: {
                        enabled: true,
                        prefix: 'alias'
                    }
                }
            }
        },
        urls: {
            doc: 'URL\'s to be shortened',
            default: {
                'default': {}
                ,
                format: Object
            }
        }
    })
    ;

// load environment dependent configuration

var env = conf.get('env');

conf.loadFile('./config.json');
conf.loadFile('./urls.json');

// perform validation

conf.validate();

module.exports = conf;