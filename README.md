# menemize

Manage your rejected Promises/A+ without ifs ;).

If you have this promise:
-------------------------

```javascript
var promise = new Promise(function (resolve, reject) {
  reject({
    "error": {
      "message": "Not found!",
      "value": 404
    }
  });
});
```


You can transform this:
-------------------------

```javascript

promise.catch(function(response){
    if(response){
        if(response.error.value == 404){
            console.log("Oh no! The file doesn't exist.")
        } else if(response.error.value == 403){
            console.log("Hey! You don't have permissions to see this file.");
        } else if(response.error.value == 500){
            console.log("Oh no! There is something wrong with the server.");
        }
    }
});
```


Into this!
--------

```javascript

menemize(promise,"error.value");

promise.catchOn(404, function(response){
      console.log("Oh no! The file doesn't exist.");
});

promise.catchOn(403, function(response){
      console.log("Hey! You don't have permissions to see this file.");
});

promise.catchOn(500, function(response){
      console.log("Oh no! The file doesn't exist.");
});

```

Or this!
-----------

```javascript

menemize(promise,"error.value");

promise.catchOn({
   400: function(response){
      console.log("Oh no! The file doesn't exists.");
   },
   403: function(response){
      console.log("Hey! You don't have permissions to see this file.");
   },
   500: function(response){
      console.log("Oh no! There is something wrong with the server.");
   };
});
```

It also works with Q and all the libraries that use the Promises/A+ spec:
------------------------------------------------------------------------

```javascript
var promise = Q.fcall(function(){
  throw {
    "error": {
      "message": "Not found!",
      "value": 404
    }
  };
});

menemize(promise,"error.value");

promise.catchOn(400, function(){
   console.log("Oh no! The file doesn't exists.");
));

promise.catchOn(403, function(){
   console.log("Hey! You don't have permissions to see this file.");
));

promise.catchOn(500, function(){
   console.log("Oh no! There is something wrong with the server.");
));

````

You can divide the different catches between different methods in different objects!

You can discriminate by a number or a string:


```javascript
promise.catchOn(404, function(response){
  console.log("Oh no! The file doesn't exist.")
});

promise.catchOn("ENOENT", function(response){
  console.log("Oh no! The file doesn't exist.")
});
```

Or by an object type!

```javascript

function Hammertime(){
  ...
}

var promise = Q.fcall(function(){
   throw new Hammertime(); // Or throw new Error()
});

menemize(promise);

promise.catchOn(Error, function(){
      console.log("Oh, it's an error!");
});,

promise.catchOn(Hammertime, function(){
      console.log("Or.... It's Hammertime!");
});,
```

Why is it good to avoid IFs in error handling ?
-------------------------------------------

Because if you transform your IFs in objects, you can avoid repeated code, using project prototypes, module pattern or
ES6 classes! ;).

```javascript
// Business error classes.
var AbstractErrorHandler = {
    i18n: {
      "404": "The resource {resource} doesn't exists.",
      "500": "The server had a problem."
    },
    transform: function(key){
      return this.i18n[key].replace('{' + property + '}',value);
    }
};

var fileErrorHandler = Object.create(AbstractErrorHandler);

fileErrorHandler[404] = function(error){
    console.log(this.transform(404, "resource", error.url)); //
    done();
};

// Menemize lines


menemize(promise, "error.value");

promise.catchOn(fileErrorHandler);


// And now... we reject the promise:

var promise = new Promise(function (resolve, reject) {
    reject({
      "error": {
        "message": "Not found!",
        "value": 404
      },
      'url': 'http://example.com'
    });
});

```

And you can reuse AbstractErrorHandler for any error in your app ;)