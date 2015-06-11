# menemize

Manage your rejected Promises/A+ without ifs ;).

h3. If you have this promise:

```javascript
var promise = new Promise(function (resolve, reject) {
  reject({
    "error": {
      "message": "Not found!",
      "value": 404
    }
  });
});
```javascript

h3. You can transform this:

```javascript

promise.catch(function(response){
    if(response){
        if(response.error.value == 404){
            console.log("Oh no! The file doesn't exists")
        } else if(response.error.value == 403){
            console.log("Hey! You don't have permissions to see this file");
        } else if(response.error.value == 500){
            console.log("Oh no! There is something wrong with the server.");
        }
    }
});
```

h3. To this!

```javascript

menemize(promise,"error.value");

promise.catchOn(404, function(response){
      console.log("Oh no! The file doesn't exists");
});

promise.catchOn(403, function(response){
      console.log("Hey! You don't have permissions to see this file");
});

promise.catchOn(500, function(response){
      console.log("Oh no! The file doesn't exists");
});

```

h3. Or to this!

```javascript

menemize(promise,"error.value");

promise.catchOn({
   400: function(response){
      console.log("Oh no! The file doesn't exists");
   },
   403: function(response){
      console.log("Hey! You don't have permissions to see this file");
   },
   500: function(response){
      console.log("Oh no! There is something wrong with the server.");
   };
});
```

h3. Also works with Q, and all the libraries that uses the Promises/A+ spec:

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
   console.log("Oh no! The file doesn't exists");
));

promise.catchOn(403, function(){
   console.log("Hey! You don't have permissions to see this file");
));

promise.catchOn(500, function(){
   console.log("Oh no! There is something wrong with the server.");
));

````

So, you can divide the different catchs between different methods in different objects!

You can discriminate by a number or a string:


```javascript
promise.catchOn(404, function(response){
  console.log("Oh no! The file doesn't exists")
});

promise.catchOn("ENOENT", function(response){
  console.log("Oh no! The file doesn't exists")
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
