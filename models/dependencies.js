// dependencies.js
// =========

'use strict';

const https = require('https');

const NPM_HOSTNAME = 'registry.npmjs.org';
const NPM_PATH = '/[package_name]/latest?json=true';

var keepAliveAgent = new https.Agent({ keepAlive: true });

keepAliveAgent.maxSockets = 100;

module.exports = {
  
  get: function getDependencies(packageName, tree, maxDepth, counter) {
    
    var requestOpts = {
            hostname: NPM_HOSTNAME,
            path: '/',
            agent: keepAliveAgent
        };
    
    return new Promise(function(resolve, reject) {
      
      var maxDepthReached = (maxDepth === 0);
      
      if (maxDepthReached) {
        resolve();
        return;
      }
      
      requestOpts.path = NPM_PATH.replace('[package_name]', packageName);
      
      https.get(requestOpts, function(response) {
        
        var body = '';
        
        response.on('data', function(chunk) {
          body += chunk;
        });
        
        response.on('end', function() {
          
          var packageJson = JSON.parse(body),
              hasDependenciesObj = packageJson.hasOwnProperty('dependencies'),
              packageKeys = [],
              packageKeysLen = 0,
              promises = [];
          
          if (hasDependenciesObj) {         
            packageKeys = Object.keys(packageJson.dependencies);
            packageKeysLen = packageKeys.length;
          }
          
          if (packageKeysLen > 0) {
            tree[packageName] = {};
          
            promises = [];
          
            for (let i = 0, len = packageKeys.length; i < len; i++) {
              counter.count++;
              promises.push(getDependencies(packageKeys[i], tree[packageName], maxDepth - 1, counter));
            }
          
            Promise.all(promises)
              .then(function(value) {
                resolve();
              }, function(reason) {
                reject();
              });
          } else {
            tree[packageName] = null;
            resolve();
          }
          
        });
        
        response.on('error', function(err) {
          // For now we just log and ignore the errors
          console.log(err);
          resolve();
        });
        
      });
      
    });  
  }
  
};