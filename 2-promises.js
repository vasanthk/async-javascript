/**
 * Promises
 */

/**
 * PROMISES EXAMPLES
 */
var p = fetch('foo'); // Fetch API is a simplification of XMLHttpRequest
p.then(res => {
  // handle response
});
p.catch(error => {
  // handle error
});

/**
 * Also note that .then is able to register a reaction to rejections as its second argument.
 * Just like you can omit the error reaction in .then(fulfillment), you can also omit the reaction to fulfillment. Using .then(null, rejection) which is equivalent to .catch(rejection)
 */
fetch('foo').then(
  res => {
    // handle response
  },
  err => {
    // handle error
  }
);

/**
 * Note that .then and .catch return a new promise every time.
 * That’s important because chaining can have wildly different results depending on where you append a .then or a .catch call onto.
 */

// here both callbacks are chained onto `fetch('foo')`
fetch('foo').then(res => {}, error => {});

// this example is identical to the previous one
var p = fetch('foo');
p.then(res => {}, error => {});

// even though semantics are different, this one is also the same
var p2 = fetch('foo');
p2.then(res => {});
p2.catch(error => {});

// here, though `.catch` is chanined onto `.then`
// and not onto the original promise
fetch('foo').then(res => {}).catch(error => {});
