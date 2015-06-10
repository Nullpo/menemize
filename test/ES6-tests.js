var menemize = require('../dist/menemize.js');

describe("Privatize all the ES6 promises!",function(){
  describe ("Reject promises with strings/numbers", function() {
    it("catch with catchOn function", function (done) {
      var prom1 = false;
      var prom2 = false;
      var prom3 = false;
      var prom4 = false;

      var isDone = function () {
        if (prom1 === true && prom2 === true && prom3 === true && prom4 === true) {
          done();
        }
      };

      var promise = new Promise(function (resolve, reject) {
        reject({
          "error": 100,
          "message": "Error cien!"
        })
      });

      menemize(promise);

      promise.catchOn(100, function (error) {
        if (prom1) fail();
        prom1 = true;
        isDone();
      });

      promise.catchOn(200, function (error) {
        fail();
      });

      promise.catchOn(100, function (error) {
        if (prom2) fail();
        prom2 = true;
        isDone();
      });

      promise.catchOn(100, function (error) {
        if (prom3) fail();
        prom3 = true;
        isDone();
      });

      promise.catch(function (error) {
        if (prom4) fail();
        prom4 = true;
        isDone();
      });
    });
    it("catch waiting a time interval", function(done){
      var prom1 = false;
      var prom2 = false;
      var prom3 = false;
      var prom4 = false;

      var isDone = function(){
        if(prom1 === true && prom2 === true && prom3 === true && prom4 === true){
          done();
        }
      };

      var promise = new Promise(function(resolve,reject){
        var err = {
          "error": 100,
          "message": "Error cien!"
        };

        setTimeout(function(){
          reject(err);
        }, 300);
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
    })
  });

  describe ("Reject promises with key-value object", function() {
    it("catch with catchOn object", function (done) {
      var promise = new Promise(function (resolve, reject) {
        reject({
          "error": {
            "message": "Not found!",
            "value": 404
          }
        });
      });

      menemize(promise, "error.value");

      promise.catchOn({
        404: function (error) {
          done();
        },
        403: function (error) {
          fail();
        },
        500: function (error) {
          fail();
        }
      });
    });
  });

  describe ("Reject promises by Type", function(){
    it("Dispatch the rejection to the expected type callback", function(done) {
      var err = new Error();
      var err2 = new Date();

      var promise = new Promise(function (resolve, reject) {
        reject(err2);
      });

      menemize(promise);

      promise.catchOn(Error, function (error) {
        fail();
      });

      promise.catchOn(Date, function (error) {

        done();
      });
    });
  })
});
