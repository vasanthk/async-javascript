/**
 * ES6 Promises
 *
 * @Reference: https://ponyfoo.com/articles/es6-promises-in-depth
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
fetch('foo').then(res => {
}, error => {
});

// this example is identical to the previous one
var p = fetch('foo');
p.then(res => {
}, error => {
});

// even though semantics are different, this one is also the same
var p2 = fetch('foo');
p2.then(res => {
});
p2.catch(error => {
});

// here, though `.catch` is chanined onto `.then`
// and not onto the original promise
fetch('foo')
  .then(res => {
  })
  .catch(error => {
  });

/**
 * PROMISE catch()
 */

// What if an error happens in one of the reactions passed to .then? You can catch those with .catch.
// The example in the snippet below logs the error caught when trying to access prop from the undefined a property in res.
fetch('foo')
  .then(res => res.a.prop.that.does.not.exist)
  .catch(err => console.error(err.message));
// <- 'Cannot read property "prop" of undefined'


// Note that where you tack your reactions onto matters. The following example won’t print the err.message twice – only once.
// That’s because no errors happened in the first .catch, so the rejection branch for that promise wasn’t executed.
fetch('foo')
  .then(res => res.a.prop.that.does.not.exist)
  .catch(err => console.error(err.message))
  .catch(err => console.error(err.message));
// <- 'Cannot read property "prop" of undefined'


// In contrast, the snippet found below will print the err.message twice.
// It works by saving a reference to the promise returned by .then, and then tacking two .catch reactions onto it.
// The second .catch in the previous example was capturing errors produced in the promise returned from the first .catch, while in this case both .catch branch off of p.
var p = fetch('foo').then(res => res.a.prop.that.does.not.exist);
p.catch(err => console.error(err.message));
p.catch(err => console.error(err.message));
// <- 'Cannot read property "prop" of undefined'
// <- 'Cannot read property "prop" of undefined'


// Here’s another example that puts that difference the spotlight.
// The second catch is triggered this time because it’s bound to the rejection branch on the first .catch.
fetch('foo')
  .then(res => res.a.prop.that.does.not.exist)
  .catch(err => {
    throw new Error(err.message)
  })
  .catch(err => console.error(err.message));
// <- 'Cannot read property "prop" of undefined'


// If the first .catch call didn’t return anything, then nothing would be printed.
  fetch('foo')
  .then(res => res.a.prop.that.does.not.exist)
  .catch(err => {})
  .catch(err => console.error(err.message));
// nothing happens

/**
 * CHAINED REFERENCES
 * You can save a reference to any point in the promise chain.
 */
var p1 = fetch('foo');
var p2 = p1.then(res => res.a.prop.that.does.not.exist);
var p3 = p2.catch(err => {});
var p4 = p3.catch(err => console.error(err.message));

/**
 * CREATING NEW PROMISES
 */
new Promise(resolve => resolve()); // promise is fulfilled
new Promise((resolve, reject) => reject()); // promise is rejected

new Promise(resolve => resolve({ foo: 'bar' }))
  .then(result => console.log(result));
// <- { foo: 'bar' }

new Promise((resolve, reject) =>
  reject(new Error('failed to deliver on my promise to you')))
  .catch(reason => console.log(reason));
// <- Error: failed to deliver on my promise to you

/**
 * It’s important to note that only the first call made to either resolve/reject will have an impact – once a promise is settled, it’s result can’t change
 */
function resolveUnderThreeSeconds (delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, delay);
    setTimeout(reject, 3000);
  })
}
resolveUnderThreeSeconds(2000); // resolves!
resolveUnderThreeSeconds(7000);// fulfillment took so long, it was rejected.