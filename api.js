'use strict';
const Homey = require('homey');
module.exports = [
    {
        method: 'POST',
        path: '/discover/',
        fn: async (args, callback) => {
            try {
                let result = await this.homey.app.discover();
                return callback(null, result);
            } catch (err) {
                return callback(err);
            }
        }
    },
    {
        method: 'POST',
        path: '/authenticate/',
        fn: async (args, callback) => {
            try {
                let result = await this.homey.app.authenticate(args.body.name, args.body.secret);
                return callback(null,result);
            } catch (err) {
                return callback(err);
            }
        } 
    },
    {
        method: 'POST',
        path: '/connect/',
        fn: async (args, callback) => {
            try {
                let result = await this.homey.app.connect();
                return callback(null, result);
            } catch (err) {
                return callback(err);
            }
        }
    }
];
