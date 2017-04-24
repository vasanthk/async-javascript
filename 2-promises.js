/**
 * ES6 Promises
 *
 * @Reference:
 * https://ponyfoo.com/articles/es6-promises-in-depth
 * http://www.2ality.com/2014/10/es6-promises-api.html
 * http://www.mattgreer.org/articles/promises-in-wicked-detail/
 * http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
 * https://dev.to/azizhk110/javascript-promise-chaining--error-handling
 *
 * @Exercise:
 * http://jsbin.com/tuqukakawo/1/edit?js,console,output
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
  .catch(err => {
  })
  .catch(err => console.error(err.message));
// nothing happens

/**
 * CHAINED REFERENCES
 * You can save a reference to any point in the promise chain.
 */
var p1 = fetch('foo');
var p2 = p1.then(res => res.a.prop.that.does.not.exist);
var p3 = p2.catch(err => {
});
var p4 = p3.catch(err => console.error(err.message));

/**
 * CREATING NEW PROMISES
 */
new Promise(resolve => resolve()); // promise is fulfilled
new Promise((resolve, reject) => reject()); // promise is rejected

new Promise(resolve => resolve({foo: 'bar'}))
  .then(result => console.log(result));
// <- { foo: 'bar' }

new Promise((resolve, reject) =>
  reject(new Error('failed to deliver on my promise to you')))
  .catch(reason => console.log(reason));
// <- Error: failed to deliver on my promise to you

/**
 * It’s important to note that only the first call made to either resolve/reject will have an impact – once a promise is settled, it’s result can’t change
 */
function resolveUnderThreeSeconds(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, delay);
    setTimeout(reject, 3000);
  })
}
resolveUnderThreeSeconds(2000); // resolves!
resolveUnderThreeSeconds(7000);// fulfillment took so long, it was rejected.

/**
 * Besides returning resolution values, you could also resolve with another promise.
 *
 * In the following snippet we create a promise p that will be rejected in three seconds.
 * We also create a promise p2 that will be resolved with p in a second.
 * Since p is still two seconds out, resolving p2 won’t have an immediate effect.
 * Two seconds later, when p is rejected, p2 will be rejected as well, with the same rejection reason that was provided to p.
 *
 * This behavior is only possible for fulfillment branches using resolve.
 * If you try to replicate the same behavior with reject you’ll find that the p2 promise is just rejected with the p promise as the rejection reason.
 */
var p = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
});
var p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p), 1000)
});
p2.then(result => console.log(result));
p2.catch(error => console.log(error));
// <- Error: fail

/**
 * SETTLING A PROMISE
 *
 * In the example below, p is resolved with a value of 100 after two seconds. Then, 100 is printed onto the screen.
 * Two seconds later, another .then branch is added onto p, but since p has already fulfilled, the new branch gets executed right away.
 *
 * A promise can return another promise – this is what enables and powers most of their asynchronous behavior.
 */
var p = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(100), 2000)
});
p.then(result => console.log(result));
// <- 100

setTimeout(() => p.then(result => console.log(result * 20)), 4000);
// <- 2000

/**
 * Paying a Promise with another Promise
 *
 * We use a promise and .then another promise that will only be settled once the returned promise also settles.
 */
var p = Promise.resolve()
  .then(data => new Promise(function (resolve, reject) {
    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
  }));

p.then(data => console.log('okay!'));
p.catch(data => console.log('boo!'));

/**
 * Transforming values in Promises
 */
Promise.resolve([1, 2, 3])
  .then(values => values.map(value => value * 2))
  .then(values => console.log(values));
// <- [2, 4, 6]

// NOTE: You can do the same thing in rejection branches.
// Interestingly, if a .catch branch goes smoothly without errors, then it will be fulfilled with the returned value.
// The following piece of code takes an internal error and masks it behind a generic “Internal Server Error” message as to not leak off potentially dangerous information to its clients
Promise.reject(new Error('Database ds.214.53.4.12 connection timeout!'))
  .catch(error => {
    throw new Error('Internal Server Error')
  })
  .catch(error => console.info(error));
// <- Error: Internal Server Error


/**
 * Promise.all()
 *
 * Promises already make the “run this after this other thing in series” use case very easy, using .then as we saw in several examples earlier. For the “run these things concurrently” use case, we can use Promise.all
 */
Promise.all([
  fetch('/'),
  fetch('foo')
])
  .then(responses => responses.map(response => response.statusText))
  .then(status => console.log(status.join(', ')));
// <- 'OK, Not Found'

// Note that even if a single dependency is rejected, the Promise.all method will be rejected entirely as well.
Promise.all([
  Promise.reject(),
  fetch('/'),
  fetch('foo')
])
  .then(responses => responses.map(response => response.statusText))
  .then(status => console.log(status.join(', ')));
// nothing happens


/**
 * Promise.race()
 * This is a similar method to Promise.all, except the first promise to settle will “win” the race, and its value will be passed along to branches of the race.
 */
Promise.race([
  fetch('/'),
  fetch('foo')
])
  .then(response => console.log(response.statusText));
// <- 'OK', or maybe 'Not Found'.


// Rejections will also finish the race, and the race promise will be rejected.
// This could be useful for scenarios where we want to time out a promise we otherwise have no control over.
var p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);
p.then(response => console.log(response));
p.catch(error => console.log(error));


/**
 * How can I use Promises when most of the libraries out there exposes a callback interfaces only?
 *
 * Well, it is pretty easy - the only thing that you have to do is wrapping the callback the original function calls with a Promise
 */
function saveToTheDb(value) {
  return new Promise(function (resolve, reject) {
    db.values.insert(value, function (err, user) { // remember error first
      if (err) {
        return reject(err);
      }
      resolve(user);
    })
  });
}
