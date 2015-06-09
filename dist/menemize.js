'use strict';

var NoOthers = {};

var PrivatizedPromise = function(q,keyToCheck){
  var self = this;
  keyToCheck = keyToCheck;

  this.valueFromCatch;

  // This can be improved
  this.on = function(property, callback){
    var properties;
    if(callback) {
      q.catch(function (error) {
        if (error &&
          searchProperty(error, keyToCheck) == property) {
          return callback(error);
        }
      });
    } else {
      properties = property;
      q.catch(function(error){
        if(error){
          var callback = properties[searchProperty(error, keyToCheck)];
          if(callback){
            return callback(error);
          }
        }
      })
    }
  };
};

function searchProperty(object, string){
  var objectChains = string.split(".");
  var actualObj = object;
  var i = 0;
  var loEncontre = false;

  while(i < objectChains.length){
    if(actualObj) {
      actualObj = actualObj[objectChains[i++]];
    } else {
      return actualObj;
    }
  }

  return actualObj;
}


var Menemize = function(q, keyToCheck){
  var privatized = new PrivatizedPromise(q, keyToCheck || "error");

  q.catchOn = function catchOn(property, callback){
    return privatized.on(property, callback);
  };

  q.failOn = function catchOn(property, callback){
    return privatized.on(property, callback);
  };

  q.lastCatch = function lastCatch(property, callback){
    return privatized.on(NoOthers, callback);
  };

  return q;
};




if(typeof module !== 'undefined'){
  module.exports = Menemize;
}