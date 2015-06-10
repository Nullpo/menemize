'use strict';

var NoOthers = {};

var PrivatizedCatch = function(promise, keyToCheck){
  this.onProperty = function(property, callback){
    promise.catch(function (error) {
      if (error &&
        searchProperty(error, keyToCheck) == property) {
        return callback(error);
      }
    });
  };

  this.onMap = function(map, callback){
    promise.catch(function(error){
      if(error){
        var callback = map[searchProperty(error, keyToCheck)];
        if(callback){
          return callback(error);
        }
      }
    });
  };

  this.onType = function(type, callback){
    promise.catch(function(error) {
        if (error instanceof type) {
          return callback(error);
        }
    });
  };
};

function searchProperty(object, string){
  var objectChains = string.split(".");
  var actualObj = object;
  var i = 0;

  while(i < objectChains.length){
    if(actualObj) {
      actualObj = actualObj[objectChains[i++]];
    } else {
      return actualObj;
    }
  }

  return actualObj;
}

var Menemize = function(promise, keyToCheck){
  var privatized = new PrivatizedCatch(promise, keyToCheck || "error");

  promise.catchOn = function catchOn(property, callback){
    if((typeof property) == "string" || (typeof property) == "number" ){
      return privatized.onProperty(property, callback);
    } else if(!callback){
      return privatized.onMap(property);
    } else {
      return privatized.onType(property, callback);
    }

  };

  promise.failOn = function catchOn(property, callback){
    return privatized.on(property, callback);
  };

  promise.lastCatch = function lastCatch(property, callback){
    return privatized.on(NoOthers, callback);
  };

  return promise;
};

if(typeof module !== 'undefined'){
  module.exports = Menemize;
}