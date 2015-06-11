var should    = require('should');
var Q         = require('q');
var menemize  = require('../dist/menemize.js');

describe("Privatize all the Q promises!",function(){
  it("catch with fCall    & catchOn function", function(done){
    var prom1 = false;
    var prom2 = false;
    var prom3 = false;
    var prom4 = false;

    var isDone = function(){
      if(prom1 === true && prom2 === true && prom3 === true && prom4 === true){
        done();
      }
    };

    var promise = Q.fcall(function(){
      throw {
        "error": 100,
        "message": "Error cien!"
      }
    });

    menemize(promise);

    promise.catchOn(100, function(error){
      if(prom1) fail();
      prom1 = true;
      isDone();
    });

    promise.catchOn(200,function(error){
      fail();
    });

    promise.catchOn(100,function(error){
      if(prom2) fail();
      prom2 = true;
      isDone();
    });

    promise.catchOn(100,function(error){
      if(prom3) fail();
      prom3 = true;
      isDone();
    });

    promise.catch(function(error){
      if(prom4) fail();
      prom4 = true;
      isDone();
    });
  });
  it("catch with deferred & catchOn function", function(done){
    var prom1 = false;
    var prom2 = false;
    var prom3 = false;
    var deferred = Q.defer();

    var isDone = function(){
      if(prom1 === true && prom2 === true && prom3 === true){
        done();
      }
    };

    var promise = deferred.promise;

    menemize(promise);

    promise.catchOn(100, function(error){
      if(prom1) fail();
      prom1 = true;
      isDone();
    });

    promise.catchOn(200,function(error){
      fail();
    });

    promise.catchOn(100,function(error){
      if(prom2) fail();
      prom2 = true;
      isDone();
    });

    promise.catch(function(error){
      if(prom3) fail();
      prom3 = true;
      isDone();
    });

    deferred.reject({
      "error": 100,
      "message": "Error cien!"
    });
  });

  it("catch with fcall    & catchOn object", function(done){
    var promise = Q.fcall(function(){
      throw {
        "error": {
          "message": "Not found!",
          "value": 404
        }
      }
    });

    menemize(promise, "error.value");

    promise.catchOn({
      404: function(error){
        done();
      },
      403: function(error){
        fail();
      },
      500: function(error){
        fail();
      }
    });
  });
  it("catch with deferred & catchOn object", function(done){
    var deferred = Q.defer();
    var promise = deferred.promise;

    deferred.reject({
      "error": {
        "message": "Not found!",
        "value": 404
      }
    });

    menemize(promise, "error.value");

    promise.catchOn({
      404: function(error){
        done();
      },
      403: function(error){
        fail();
      },
      500: function(error){
        fail();
      }
    });
  });

  it("catch with deferred & catchOn object & setTimeout", function(done){
    var deferred = Q.defer();
    var promise = deferred.promise;

    setTimeout(function() {
      deferred.reject({
        "error": {
          "message": "Not found!",
          "value": 404
        }
      })
    }, 200);

    menemize(promise, "error.value");

    promise.catchOn({
      404: function(error){
        done();
      },
      403: function(error){
        fail();
      },
      500: function(error){
        fail();
      }
    });
    promise.then(function(){
      fail();
    });
  });
});
