/**
 * Callback
 */

/**
 * EXAMPLES
 */

//Note that the item in the click method's parameter is a function, not a variable.​ The item is a callback function
$("#btn_1").click(function() {
  alert("Btn 1 Clicked");
});

// forEach()
var friends = ["Mike", "Stacy", "Andy", "Rick"];

friends.forEach(function (eachName, index){
  // Inside callback function.
  console.log(index + 1 + ". " + eachName); // 1. Mike, 2. Stacy, 3. Andy, 4. Rick​
});

