/**
 * Async Functions (ES7)
 *
 * @Reference:
 * http://www.sitepoint.com/simplifying-asynchronous-coding-es7-async-functions/
 * http://pouchdb.com/2015/03/05/taming-the-async-beast-with-es7.html
 * http://h3manth.com/new/blog/2015/es7-async-await/
 * http://h3manth.com/new/blog/2015/are-you-async-yet/
 */

// Async Functions Syntax
async function doAsyncOp() {
  var val = await asynchronousOperation();
  console.log(val);
  return val;
}

// Equivalent function using ES6 Promises
function doAsyncOp() {
  return asynchronousOperation().then(function (val) {
    console.log(val);
    return val;
  });
}

// Await returns a promise
async function myFunction() {
  let result = await somethingThatReturnsAPromise();
  console.log(result); // cool, we have a result
}

// If the promise resolves, we can immediately interact with it on the next line.
// And if it rejects, then an error is thrown. So try/catch actually works again!
// Good Practise: Ensure that your async functions are entirely surrounded by try/catches, at least at the top level:
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err); // oh noes, we got an error
  }
}

/**
 * Chaining Operations
 */
// Using Promises
function doAsyncOp() {
  return asynchronousOperation().then(function (val) {
    return asynchronousOperation(val);
  }).then(function (val) {
    return asynchronousOperation(val);
  }).then(function (val) {
    return asynchronousOperation(val);
  });
}

// Using Async functions - we just act like asynchronousOperation is synchronous
async function doAsyncOp() {
  var val = await asynchronousOperation();
  val = await asynchronousOperation(val);
  val = await asynchronousOperation(val);
  return await asynchronousOperation(val);
  // You don’t even need the await keyword on that return statement because either way it will return a promise resolving to the final value.
}

/**
 * Parallel Operations
 */
// Using Promise.all()
function doAsyncOp() {
  return Promise.all([asynchronousOperation(), asynchronousOperation()])
    .then(function (vals) {
      vals.forEach(console.log);
      return vals;
    });
}

// Using Async functions -- You still need to use Promise directly.
function doAsyncOp() {
  var vals = await
  Promise.all([asynchronousOperation(), asynchronousOperation()]);
  vals.forEach(console.log.bind(console));
  return vals;
}

// There is a proposal in ES7 to make the above function simpler (Dated Nov 22, 2015)
// The idea is that await* EXPRESSION would be converted to await Promise.all(EXPRESSION) behind the scenes, which allows us to be more terse and avoid using the Promise API directly.
// In this case the previous example would look like this:
async function doAsyncOp() {
  var vals = await * [asynchronousOperation(), asynchronousOperation()];
  vals.forEach(console.log.bind(console));
  return vals;
}

/**
 * Handling Rejections
 */
// Using promises
function doAsyncOp() {
  return asynchronousOperation().then(function (val) {
    return asynchronousOperation(val);
  }).then(function (val) {
    return asynchronousOperation(val);
  }).catch(function (err) {
    console.error(err);
  });
}

// Using async functions
async function doAsyncOp() {
  try {
    var val = await asynchronousOperation();
    val = await asynchronousOperation(val);
    return await asynchronousOperation(val);
  } catch (err) {
    console.err(err);
  }
}

/**
 * Broken Promises
 */
// Using promises: You can throw an error—either inside the Promise constructor or within a then or catch callback
function doAsyncOp() {
  return new Promise(function (resolve, reject) {
    if (somethingIsBad) {
      reject(new Error('something is bad'));
      // OR
      // reject('something is bad');
      // OR
      // throw new Error('something is bad');
    }
    resolve('nothing is bad');
  });
}

// Using async functions: The scope issue doesn’t arise—you can throw an error anywhere within an async function and it will be caught by the promise
async function doAsyncOp() {
  // the next line is fine
  throw new Error('something is bad');

  if (somethingIsBad) {
    // this one is good too
    throw new Error('something is bad');
  }
  return 'nothing is bad';
}

// assume `doAsyncOp` does not have the killing error
async function x() {
  var val = await doAsyncOp;

  // this one will work just fine
  throw new Error("I just think an error should be here");

  return val;
}