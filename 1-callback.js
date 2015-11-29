/**
 * Callback
 *
 * @Reference:
 * 	http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
 * 	https://www.quora.com/What-is-callback-hell
 * 	http://stackabuse.com/avoiding-callback-hell-in-node-js/
 */

/**
 * CALLBACK EXAMPLES
 */

//Note that the item in the click method's parameter is a function, not a variable.​ The item is a callback function
$("#btn_1").click(function () {
  alert("Btn 1 Clicked");
});

// forEach()
var friends = ["Mike", "Stacy", "Andy", "Rick"];
friends.forEach(function (eachName, index) {
  // Inside callback function.
  console.log(index + 1 + ". " + eachName); // 1. Mike, 2. Stacy, 3. Andy, 4. Rick​
});

/**
 * CALLBACK HELL
 *
 *  A fragile, unreadable sequence of asynchronous operations, represented by nested anonymous functions, idiomatic to node.js applications
 */

getData(function (a) {
  getMoreData(a, function (b) {
    getMoreData(b, function (c) {
      getMoreData(c, function (d) {
        getMoreData(d, function (e) {
          console.log('Callback Hell');
        });
      });
    });
  });
});

/**
 * NAME YOUR FUNCTIONS
 *
 * * Easier to read.
 * * When exceptions happen you will get stacktraces that reference actual function names instead of "anonymous".
 */

// Anonymous function
var form = document.querySelector('form');
form.onsubmit = function (submitEvent) {
  var name = document.querySelector('input').value;
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, function (err, response, body) {
    var statusMessage = document.querySelector('.status');
    if (err) return statusMessage.value = err;
    statusMessage.value = body;
  })
};

// Named functions
var form = document.querySelector('form');
form.onsubmit = function formSubmit(submitEvent) {
  var name = document.querySelector('input').value;
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, function postResponse(err, response, body) {
    var statusMessage = document.querySelector('.status');
    if (err) return statusMessage.value = err;
    statusMessage.value = body;
  })
};

/**
 * KEEP YOUR CODE SHALLOW
 *
 * * Easier to edit, refactor and hack on later
 */

// Get rid of triple level nesting which was there earlier.
function formSubmit(submitEvent) {
  var name = document.querySelector('input').value;
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, postResponse)
}

function postResponse(err, response, body) {
  var statusMessage = document.querySelector('.status');
  if (err) return statusMessage.value = err;
  statusMessage.value = body
}

document.querySelector('form').onsubmit = formSubmit;

/**
 * MODULARIZE
 *
 * * Easier to understand, reuse without duplication.
 */

function formSubmit(submitEvent) {
  var name = document.querySelector('input').value;
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, postResponse)
}

function postResponse(err, response, body) {
  var statusMessage = document.querySelector('.status');
  if (err) return statusMessage.value = err;
  statusMessage.value = body;
}

exports.submit = formSubmit;  // CommonJS module system

// USAGE
var formUploader = require('formuploader');
document.querySelector('form').onsubmit = formUploader.submit;