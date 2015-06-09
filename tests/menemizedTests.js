var should = require('should');
var Q = require('q');
var menemize = require('../dist/menemize.js');

describe("Privatize all the things!",function(){
  it("catch with fCall", function(done){
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
      console.log("error1:" , error);
      prom1 = true;
      isDone();
    });

    promise.catchOn(200,function(error){
      console.log("Nunca pasa por aca:" , error);
      fail();
    });

    promise.catchOn(100,function(error){
      console.log("error2:" , error);
      prom2 = true;
      isDone();
    });

    promise.catchOn(100,function(error){
      console.log("error3:" , error);
      prom3 = true;
      isDone();
    });

    promise.catch(function(error){
      console.log("Catch fuera de los catchOn" , error);
      prom4 = true;
      isDone();
    });
  });
  it("catch with deferred", function(done){
    var prom1 = false;
    var prom2 = false;
    var prom3 = false;
    var prom4 = false;
    var deferred = Q.defer();

    var isDone = function(){
      if(prom1 === true && prom2 === true && prom3 === true){
        done();
      }
    };

    var promise = deferred.promise;

    menemize(promise);

    promise.catchOn(100, function(error){
      prom1 = true;
      isDone();
    });

    promise.catchOn(200,function(error){
      fail();
    });

    promise.catchOn(100,function(error){
      prom2 = true;
      isDone();
    });

    promise.catch(function(error){
      console.log("Catch fuera de los catchOn" , error);
      prom3 = true;
      isDone();
    });

    deferred.reject({
      "error": 100,
      "message": "Error cien!"
    });
  });
  it("catch with object", function(done){
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
        console.log("error404:" , error);
        done();
      },
      403: function(error){
        console.log("error403:" , error);
        fail();
      },
      500: function(error){
        console.log("error500:" , error);
        fail();
      }
    });
  });
});

