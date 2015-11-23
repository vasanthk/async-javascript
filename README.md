# Asynchronous JavaScript
Evolution of Async handling in JavaScript!

## Callbacks
In JavaScript, functions are first-class objects; that is, functions are of the type Object and they can be used in a first-class manner like any other object (String, Array, Number, etc.) since they are in fact objects themselves. They can be “stored in variables, passed as arguments to functions, created within functions, and returned from functions”.

Because functions are first-class objects, we can pass a function as an argument in another function and later execute that passed-in function or even return it to be executed later. This is the essence of using callback functions in JavaScript. 

A callback function, also known as a higher-order function, is a function that is passed to another function (let’s call this other function “otherFunction”) as a parameter, and the callback function is called (or executed) inside the otherFunction.

### How Callback Functions Work?
We can pass functions around like variables and return them in functions and use them in other functions. When we pass a callback function as an argument to another function, we are only passing the function definition. We are not executing the function in the parameter. In other words, we aren’t passing the function with the trailing pair of executing parenthesis () like we do when we are executing a function.

And since the containing function has the callback function in its parameter as a function definition, it can execute the callback anytime. Note that the callback function is not executed immediately. It is “called back” (hence the name) at some specified point inside the containing function’s body.

When we pass a callback function as an argument to another function, the callback is executed at some point inside the containing function’s body just as if the callback were defined in the containing function. This means the callback is a closure. As we know, closures have access to the containing function’s scope, so the callback function can access the containing functions’ variables, and even the variables from the global scope.

### Basic Principles when Implementing Callback Functions
* Use Named OR Anonymous Functions as Callbacks
* Can pass Parameters to Callback Functions
  * Since the callback function is just a normal function when it is executed, we can pass parameters to it. We can pass any of the containing function’s properties (or global properties) as parameters to the callback function.
* Make Sure Callback is a Function Before Executing It
  * It is always wise to check that the callback function passed in the parameter is indeed a function before calling it. Also, it is good practice to make the callback function optional.
* Use the Call or Apply Function To Preserve `this`
  * When the callback function is a method that uses the this object, we have to modify how we execute the callback function to preserve the this object context. Or else the this object will either point to the global window object (in the browser), if callback was passed to a global function. Or it will point to the object of the containing method.
  * We can fix the preceding problem by using the Call or Apply function. Call and Apply are used to set the this object inside the function and to pass arguments to the functions.
* Multiple Callback Functions Allowed
  * We can pass more than one callback functions into the parameter of a function, just like we can pass more than one variable.
  
### “Callback Hell” Problem And Solution
In asynchronous code execution, which is simply execution of code in any order, sometimes it is common to have numerous levels of callback functions to the extent that it is messy and hard to comprehend.
 
Here are two solutions to this problem:
 * Name your functions and declare them and pass just the name of the function as the callback, instead of defining an anonymous function in the parameter of the main function. It makes code easier to read and also helps to get better stack traces when exeptions happen.
 * Modularity: Separate your code into modules, so you can export a section of code that does a particular job. Then you can import that module into your larger application.
     
### Callback functions - Benefits
* Do not repeat code (DRY—Do Not Repeat Yourself)
* Implement better abstraction where you can have more generic functions that are versatile (can handle all sorts of functionalities)
* Have better maintainability
* Have more readable code
* Have more specialized functions.  

### Callback functions - Use cases
* For asynchronous execution (such as reading files, and making HTTP requests)
* In Event Listeners/Handlers
* In setTimeout and setInterval methods
* For Generalization: code conciseness

### Links
* [Understand JavaScript Callback Functions and Use Them](http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/)  
* [Callback Hell](http://callbackhell.com/)
* [Avoiding Callback hell in Node.js](http://stackabuse.com/avoiding-callback-hell-in-node-js/)

## Promises
Promises are usually vaguely defined as “a proxy for a value that will eventually become available”. They can be used for both synchronous and asynchronous code flows, although they make asynchronous flows easier to reason about.

Promises can be chained “arbitrarily”, that is to say - you can save a reference to any point in the promise chain and then tack more promises on top of it. This is one of the fundamental points to understanding promises.

Promises can be created from scratch by using new Promise(resolver). The resolver parameter is a method that will be used to resolve the promise. It takes two arguments, a resolve method and a reject method. These promises are fulfilled and rejected, respectively, on the next tick.
Usually promises will resolve to some result, like the response from an AJAX call. Similarly, you’ll probably want to state the reason for your rejections – typically using an Error object. 

### Settling a promise
Promises can exist in three states: pending, fulfilled, and rejected. Pending is the default state. From there, a promise can be “settled” into either fulfillment or rejection. Once a promise is settled, all reactions that are waiting on it are evaluated. Those on the correct branch – .then for fulfillment and .catch for rejections – are executed.

From this point on, the promise is settled. If at a later point in time another reaction is chained onto the settled promise, the appropriate branch for that reaction is executed in the next tick of the program. Interestingly, if a .catch branch goes smoothly without errors, then it will be fulfilled with the returned value.

Promises already make the “run this after this other thing in series” use case very easy, using .then as we saw in several examples earlier. For the “run these things concurrently” use case, we can use Promise.all()

Promise.all has two possible outcomes.
* Settle with a single rejection reason as soon as one of its dependencies is rejected.
* Settle with all fulfillment results as soon as all of its dependencies are fulfilled.

Promise.race() is similar to Promise.all, except the first promise to settle will “win” the race, and its value will be passed along to branches of the race. 
Rejections will also finish the race, and the race promise will be rejected. This could be useful for scenarios where we want to time out a promise we otherwise have no control over.

### Links
* [ES6 Promises in Depth](https://ponyfoo.com/articles/es6-promises-in-depth) 
* [Promises for asynchronous programming](http://exploringjs.com/es6/ch_promises.html)
* [ECMAScript 6 promises: the API](http://www.2ality.com/2014/10/es6-promises-api.html)
* [JavaScript Promises ... In Wicked Detail](http://www.mattgreer.org/articles/promises-in-wicked-detail/)
* [ES6 Promises](http://www.datchley.name/es6-promises/)
* [Promise Patterns & Anti-Patterns](http://www.datchley.name/promise-patterns-anti-patterns/)
* [What’s the deal with jQuery Deferred objects and Promises?](http://www.vasanthk.com/jquery-promises-and-deferred-objects/)

## Generators (ES6)
Generators, a new feature of ES6, are functions that can be paused and resumed. This helps with many applications: iterators, asynchronous programming, etc.

Two important applications of generators are:
* Implementing iterables
* Blocking on asynchronous function calls

### Creating Generators
There are four ways in which you can create generators:
* Via a generator function declaration:

    ```javascript
    function* genFunc() { ··· }
    let genObj = genFunc();
    ```
    
* Via a generator function expression:

    ```javascript
    const genFunc = function* () { ··· };
    let genObj = genFunc();
    ```
    
* Via a generator method definition in an object literal:

    ```javascript
    let obj = {
        * generatorMethod() {
            ···
        }
    };
    let genObj = obj.generatorMethod();
    ```
    
* Via a generator method definition in a class definition (which can be a class declaration or a class expression [11]):

    ```javascript
    class MyClass {
        * generatorMethod() {
            ···
        }
    }
    let myInst = new MyClass();
    let genObj = myInst.generatorMethod();
    ```
    
### Roles played by generators
* **Iterators (data producers):** 
  * Each yield can return a value via next(), which means that generators can produce sequences of values via loops and recursion. Due to generator objects implementing the interface Iterable, these sequences can be processed by any ES6 construct that supports iterables. Two examples are: for-of loops and the spread operator (...).
* **Observers (data consumers):** 
  * yield can also receive a value from next() (via a parameter). That means that generators become data consumers that pause until a new value is pushed into them via next().
* **Coroutines (data producers and consumers):** 
  * Given that generators are pausable and can be both data producers and data consumers, not much work is needed to turn them into coroutines (cooperatively multitasked tasks).    
  
### Processing asynchronously pushed data (Generators as observers)
The fact that generators-as-observers pause while they wait for input makes them perfect for on-demand processing of data that is received asynchronously. The pattern for setting up a chain of generators for processing is as follows:
* **First chain member:** A normal function that has a parameter target, which is the generator object of the next element in the chain of generators. The function makes an asynchronous request and pushes the results to the target via target.next().
* **Intermediate chain members:** Generators that have a parameter target. They receive data via yield and send data via target.next().
* **Last chain member:** A generator that has no parameter target and only receives data.
   
### Links
* [ES6 Generators in depth](http://www.2ality.com/2015/03/es6-generators.html)
* [The Basics Of ES6 Generators](https://davidwalsh.name/es6-generators)
* [No promises: asynchronous JavaScript with only generators](http://www.2ality.com/2015/03/no-promises.html)
* [ES6 Generators in Depth](https://ponyfoo.com/articles/es6-generators-in-depth)

## Async Functions (ES7)
Async functions take the idea of using generators for asynchronous programming and give them their own simple and semantic syntax.

### Converting Promises to Async Functions
Here is an example of using async functions:

```javascript
async function doAsyncOp () {
    var val = await asynchronousOperation();
    console.log(val);
    return val;
}
```
Here's its implementation using Promises
```javascript
function doAsyncOp () {
    return asynchronousOperation().then(function(val) {
        console.log(val);
        return val;
    });
}
```
This has the same number of lines, but there is plenty of extra code due to then and the callback function passed to it. The other nuisance is the duplication of the return keyword, it makes it difficult to figure out exactly what is being returned from a function that uses promises.
Also, Whenever you return a value from and async function, you are actually implicitly returning a promise that resolves to that value. If you don’t return anything at all, you are implicitly returning a promise that resolves to undefined.

### Chaining Operations
One of the aspects of promises that hooks many people is the ability to chain multiple asynchronous operations without running into nested callbacks. This is one of the areas in which async functions excel even more than promises.

Using promises:
```javascript
function doAsyncOp () {
    return asynchronousOperation().then(function(val) {
        return asynchronousOperation(val);
    }).then(function(val) {
        return asynchronousOperation(val);
    }).then(function(val) {
        return asynchronousOperation(val);
    });
}
```

Using Async functions, we can just act like asynchronousOperation is synchronous.
```javascript
async function doAsyncOp () {
    var val = await asynchronousOperation();
    val = await asynchronousOperation(val);
    val = await asynchronousOperation(val);
    return await asynchronousOperation(val);
}
```
You don’t even need the await keyword on that return statement because either way it will return a promise resolving to the final value.

###Parallel Operations
One of the other great features of promises is the ability to run multiple asynchronous operations at once and continue on your way once all of them have completed. Promise.all is the way to do this according to the new ES6 spec.

```javascript
function doAsyncOp () {
    return Promise.all([asynchronousOperation(), asynchronousOperation()])
        .then(function(vals) {
            vals.forEach(console.log);
            return vals;
        });
}
```

This is also possible with async functions, though you may still need to use Promise directly:
```javascript
async function doAsyncOp () {
    var vals = await Promise.all([asynchronousOperation(), asynchronousOperation()]);
    vals.forEach(console.log.bind(console));
    return vals;
}
```

### Links
* [Simplifying Asynchronous Coding with ES7 Async Functions](http://www.sitepoint.com/simplifying-asynchronous-coding-es7-async-functions/)
* [Jafar Husain: Async Programming in ES7 | JSConf US 2015](https://www.youtube.com/watch?v=lil4YCCXRYc)
* [Taming the asynchronous beast with ES7](http://pouchdb.com/2015/03/05/taming-the-async-beast-with-es7.html)