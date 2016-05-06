// cache.js
// =========

'use strict';

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('error', function (err) {
    console.log('Error ' + err);
});

module.exports = {
    get: function getPackageFromCache(packageName) {
        return client.getAsync(packageName);
    },
    
    set: function writePackageToCache(packageName, json) {
        return client.setAsync(packageName, JSON.stringify(json));
    }
}