/**
 * Async Functions (ES7)
 *
 * @Reference:
 * http://www.sitepoint.com/simplifying-asynchronous-coding-es7-async-functions/
 * http://h3manth.com/new/blog/2015/es7-async-await/
 * http://h3manth.com/new/blog/2015/are-you-async-yet/
 */

// Async Functions Syntax
async function doAsyncOp () {
  var val = await asynchronousOperation();
  console.log(val);
  return val;
}

// Equivalent function using ES6 Promises
function doAsyncOp() {
  return asynchronousOperation().then(function(val) {
    console.log(val);
    return val;
  });
}

/**
 * Chaining Operations
 */
// Using Promises
function doAsyncOp () {
  return asynchronousOperation().then(function(val) {
    return asynchronousOperation(val);
  }).then(function(val) {
    return asynchronousOperation(val);
  }).then(function(val) {
    return asynchronousOperation(val);
  });
}

// Using Async functions - we just act like asynchronousOperation is synchronous
async function doAsyncOp () {
  var val = await asynchronousOperation();
  val = await asynchronousOperation(val);
  val = await asynchronousOperation(val);
  return await asynchronousOperation(val);
  // You don’t even need the await keyword on that return statement because either way it will return a promise resolving to the final value.
}