# menemize
Manage rejected promises with Menemize!

Nowadays this library is compatible only with Q promises.

Currently you do this:

```
var promise = Q.fcall(function(){
      throw {
        "status": {
           "number": 404,
           "message": "FILE_NOT_FOUND"
        }
      }
    });

promise.catch(function(response){
    if(response){
        if(response.status.number == 404){
            console.log("Oh no! The file doesn't exists")
        } else if(response.status.number == 403){
            console.log("Hey! You don't have permissions to see this file");
        } else if(response.status.number == 500){
            console.log("Oh no! There is something wrong with the server.");
        }
    }
});

```

Now, with menemize, you can do this:

```
var promise = Q.fcall(function(){
      throw {
              "status": {
                 "number": 404,
                 "message": "FILE_NOT_FOUND"
              }
            }
    });

menemize(promise, "status.number");

promise.catchOn(400, function(){
   console.log("Oh no! The file doesn't exists")
));

promise.catchOn(403, function(){
   console.log("Hey! You don't have permissions to see this file");
));

promise.catchOn(500, function(){
   console.log("Oh no! There is something wrong with the server.");
));

```

So, you can divide the different catchs between different methods in different objects!

Also, you can do something like this:

Now, with menemize, you can do this:

```
var promise = Q.fcall(function(){
      throw {
              "status": {
                 "number": 404,
                 "message": "FILE_NOT_FOUND"
              }
            }
    });

menemize(promise, "status.number");

promise.catchOn({
   400: function(){
      console.log("Oh no! The file doesn't exists")
   },
   403: function(){
      console.log("Hey! You don't have permissions to see this file");
   },
   500: function(){
      console.log("Oh no! There is something wrong with the server.");
   };
});

```