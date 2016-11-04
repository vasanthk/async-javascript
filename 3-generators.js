/**
 * Generators
 *
 * What are generators?
 * Generators are functions which can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances.
 *
 * In computer science, a generator is a special routine that can be used to control the iteration behaviour of a loop. In fact, all generators are iterators.
 * A generator is very similar to a function that returns an array, in that a generator has parameters, can be called, and generates a sequence of values.
 * However, instead of building an array containing all the values and returning them all at once, a generator yields the values one at a time,
 * which requires less memory and allows the caller to get started processing the first few values immediately. In short, a generator looks like a function but behaves like an iterator.
 *
 * @Reference:
 * http://www.2ality.com/2015/03/es6-generators.html
 * http://www.dotnetcurry.com/javascript/1131/ecmascript6-async-using-generators-promises
 * http://thejsguy.com/2016/10/15/a-practical-introduction-to-es6-generator-functions.html
 * https://medium.com/@dtothefp/why-can-t-anyone-write-a-simple-es6-generators-tutorial-ec2bbdf6ff45#.pf0f8rfnb 
 * https://davidwalsh.name/async-generators
 * https://www.youtube.com/watch?v=QO07THdLWQo
 * https://www.youtube.com/watch?v=3UKsXCMK6Iw
 */

//  Two things distinguish genFunc from a normal function declaration:
//    It starts with the “keyword” function*.
//    It is paused in the middle via yield.
function* genFunc() {
  console.log('First');
  yield;                  // (A)
  console.log('Second');  // (B)
}
//  Calling genFunc does not execute it.
// Instead, it returns a so-called generator object that lets us control genFunc’s execution:
let genObj = genFunc();

// genFunc() is initially suspended at the beginning of its body.
// The method genObj.next() continues the execution of genFunc, until the next yield:
genObj.next();
// OUTPUT:
// First
// { value: undefined, done: false }

// genFunc is now paused in line (A).
// If we call next() again, execution resumes and line (B) is executed
genObj.next();
// OUTPUT:
// Second
// { value: undefined, done: true }


/**
 * Implementing iterables via generators
 */
// The asterisk after `function` means that`objectEntries` is a generator
function* objectEntries(obj) {
  // Reflect is a built-in object that provides methods for interceptable JavaScript operations.
  // Reflect.ownKeys returns an array of the target object's own (not inherited) property keys.
  // https://twitter.com/nilssolanki/status/659839340592422912
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    // `yield` returns a value and then pauses the generator. Later, the execution continues where it was previously paused.
    yield[propKey, obj[propKey]];
  }

}
// Usage
let jane = {first: 'Jane', last: 'Doe'};
for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// Output:
// first: Jane
// last: Doe


/**
 * Blocking on asynchronous function calls
 */
// In the following code, I use the control flow library co to asynchronously retrieve two JSON files.
// Note how, in line (A), execution blocks (waits) until the result of Promise.all() is ready.
// That means that the code looks synchronous while performing asynchronous operations.

co(function* () {
  try {
    let [croftStr, bondStr] = yield Promise.all([ // A
      getFile('http://localhost:8000/croft.json'),
      getFile('http://localhost:8000/bond.json')
    ]);
    let croftJson = JSON.parse(croftStr);
    let bondJson = JSON.parse(bondStr);

    console.log(croftJson);
    console.log(bondJson);
  } catch (e) {
    console.log('Failure to read: ' + e);
  }
});

/**
 * Understanding generators and async handling
 */

function getFirstName() {
  setTimeout(function() {
    gen.next('Jerry');
  }, 2000);
  // returns undefined
  // But next() is not called until the async activity is finished
  // After which var a is set to 'Jerry'
}

function getSecondName() {
  setTimeout(function() {
    gen.next('Seinfeld');
  }, 3000);
  // Same as getFirstName(), fn is paused until next() is called
  // And then the value is assigned to var b
}

function* getFullName() {
  var firstName = yield getFirstName();
  var lastName = yield getSecondName();
  console.log(firstName + ' ' + lastName); // Jerry Seinfeld
}

var gen = getFullName();
gen.next(); // Initialize generator flow to first `yield`

/**
 * Generators with Promises for asynchrony
 * From Talk:
 * Callback-less Asynchrony: ES6, Generators, and the next wave of JavaScript development
 * https://www.youtube.com/watch?v=3UKsXCMK6Iw
 */
// This function basically returns only after the async operations are complete.
function *run() {
  var cities = ['Chicago', 'San Francisco', 'Los Angeles', 'Santa Barbara'];

  var citiesData = cities.map(city => {
    asyncQueryFn(city);
  });

  return yield Promise.all(citiesData);
}

/**
 * Generators for Async handling
 */
// Without generator
function makeAjaxCall(url,cb) {
  // do some ajax fun
  // call `cb(result)` when complete
}

makeAjaxCall( "http://some.url.1", function(result1){
  var data = JSON.parse( result1 );

  makeAjaxCall( "http://some.url.2/?id=" + data.id, function(result2){
    var resp = JSON.parse( result2 );
    console.log( "The value you asked for: " + resp.value );
  });
} );

// With generator
function request(url) {
  // this is where we're hiding the asynchronicity,
  // away from the main code of our generator
  // `it.next(..)` is the generator's iterator-resume
  // call
  makeAjaxCall( url, function(response){
    it.next( response );
  } );
  // Note: nothing returned here!
}

function *main() {
  var result1 = yield request( "http://some.url.1" );
  var data = JSON.parse( result1 );

  var result2 = yield request( "http://some.url.2?id=" + data.id );
  var resp = JSON.parse( result2 );
  console.log( "The value you asked for: " + resp.value );
}

var it = main();
it.next(); // get it all started




// 1. Generators as iterators (data production)
/**
 * Recursion via yield*
 */
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo(); // yield* is used for making recursive generator calls.
  yield 'y';
}

// Collect all values yielded by bar() in an array
let arr = [...bar()];
// ['x', 'a', 'b', 'y']


/**
 * Iterating over trees
 */
// Consider the following data structure for binary trees.
// It is iterable, because it has a method whose key is Symbol.iterator.
// That method is a generator method and returns an iterator when called.
class BinaryTree {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  // Prefix iteration
  *[Symbol.iterator]() {
    yield this.value;
    if (this.left) {
      yield* this.left;
    }
    if (this.right) {
      yield* this.right;
    }
  }
}

// The following code creates a binary tree and iterates over it via for-of:
let tree = new BinaryTree('a',
  new BinaryTree('b',
    new BinaryTree('c'),
    new BinaryTree('d')),
  new BinaryTree('e'));

for (let x of tree) {
  console.log(x);
}
// Output:
// a
// b
// c
// d
// e


/**
 * You can only yield in generators -- yielding in callbacks doesn’t work
 */
function* genFunc() {
  ['a', 'b'].forEach(x => yield x); // SyntaxError
}

// Refactored
function* genFunc() {
  for (let x of ['a', 'b']) {
    yield x; // OK
  }
}


// 2. Generators as observers (data consumption)

/**
 * Sending values via next()
 */
// If you use a generator as an observer, you send values to it via next() and it receives those values via yield:
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`); // (A)
  console.log(`2. ${yield}`);
  return 'result';
}

// Let’s use this generator interactively. First, we create a generator object:
let genObj = dataConsumer();

// We now call genObj.next(), which starts the generator. Execution continues until the first yield, which is where the generator pauses.
// The result of next() is the value yielded in line (A) (undefined, because yield doesn’t have an operand).
genObj.next();
// OUTPUT:
// Started
// { value: undefined, done: false }

// We call next() two more times, in order to send the value 'a' to the first yield and the value 'b' to the second yield:
genObj.next('a');
// 1. a
// { value: undefined, done: false }

genObj.next('b');
// 2. b
// { value: 'result', done: true }

// The result of the last next() is the value returned from dataConsumer(). done being true indicates that the generator is finished.
// Unfortunately, next() is asymmetric, but that can’t be helped: It always sends a value to the currently suspended yield, but returns the operand of the following yield.


/**
 * The first next()
 *
 * When using a generator as an observer, it is important to note that the only purpose of the first invocation of next() is to start the observer.
 * It is only ready for input afterwards, because this first invocation has advanced execution to the first yield.
 * Therefore, you can’t send input via the first next() – you even get an error if you do
 */
function* g() {
  yield
}
g().next('hello');
// TypeError: attempt to send 'hello' to newborn generator


/**
 * yield binds loosely
 */
yield a + b + c;

// Is treated as
yield (a + b + c);

// Not as
(yield a) + b + c;


// Many operators bind more tightly than yield and you have to put yield in parentheses if you want to use it as an operand.
console.log('Hello' + yield); // SyntaxError
console.log('Hello' + yield 123); // SyntaxError
console.log('Hello' + (yield)); // OK
console.log('Hello' + (yield 123)); // OK


/**
 * return() terminates the generator
 *
 * return() performs a return at the location of the yield that led to the last suspension of the generator.
 */

function* genFunc1() {
  try {
    console.log('Started');
    yield; // (A)
  } finally {
    console.log('Exiting');
  }
}

let genObj1 = genFunc1();
genObj1.next();
// Started
//{ value: undefined, done: false }

genObj1.return('Result');
// Exiting
// { value: 'Result', done: true }


// Preventing Termination
// You can prevent return() from terminating the generator if you yield inside the finally clause
function* genFunc2() {
  try {
    console.log('Started');
    yield;
  } finally {
    yield 'Not done, yet!';
  }
}

let genObj2 = genFunc2();

genObj2.next();
// Started
// { value: undefined, done: false }

// This time, return() does not exit the generator function. Accordingly, the property done of the object it returns is false.
genObj2.return('Result');
// { value: 'Not done, yet!', done: false }

// You can invoke next() one more time. Similarly to non-generator functions,
// the return value of the generator function is the value that was queued prior to entering the finally clause.
genObj2.next();
// { value: 'Result', done: true }


// Returning from a newborn generator is allowed!
function* genFunc() {
}
genFunc().return('yes');
// { value: 'yes', done: true }


/**
 * throw() signals an error
 *
 * throw() throws an exception at the location of the yield that led to the last suspension of the generator.
 */

function* genFunc1() {
  try {
    console.log('Started');
    yield; // (A)
  } catch (error) {
    console.log('Caught: ' + error);
  }
}


// In the following interaction, we first use next() to start the generator and proceed until the yield in line (A).
// Then we throw an exception from that location.
let genObj1 = genFunc1();
genObj1.next();
// Started
// { value: undefined, done: false }

genObj1.throw(new Error('Problem!'));
// Caught: Error: Problem!
// { value: undefined, done: true }

// The result of throw() (shown in the last line) stems from us leaving the function with an implicit return.


// Throwing an exception in a newborn generator (that hasn’t started yet) is allowed:
function* genFunc() {
}
genFunc().throw(new Error('Problem!'));
// Error: Problem!


/**
 * Extras:
 * Infinite Fibonacci sequence using generators
 */

function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

var gen = fibonacci();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
console.log(gen.next().value); // 5
console.log(gen.next().value); // 8
