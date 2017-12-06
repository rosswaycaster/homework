// Array to hold all the household information
var household = [];

// Function to add person to the household array
function addPerson(e) {
  // Prevent the button from submitting the form
  e.preventDefault();

  // Retrieve the age, relationship, and smoker values
  var age = Number(document.querySelector('[name="age"]').value);
  var relationship = document.querySelector('[name="rel"]').value;
  var smoker = document.querySelector('[name="smoker"]').checked;

  // Validate the person's data
  if (validatePerson(age, relationship)) {
    // Add the person's data to the household array as an object
    household.push({
      age: age,
      relationship: relationship,
      smoker: smoker,
    });

    // Clear the form and render the household list
    clearForm();
    renderHouseholdList();
  }
}

// Function to remove a person from the household array
function removePerson(index) {
  // Remove the specific person
  household.splice(index, 1);

  // Rerender the household list
  renderHouseholdList();
}

// Function to validate a person's data
function validatePerson(age, relationship) {
  if (!age || age <= 0) {
    // Alert and return false if age is falsy or less than 0
    alert('Age must be greater than 0.');
    return false;
  } else if (!relationship) {
    // Alert and return false if relationship is falsy
    alert('Relationship must be defined.');
    return false;
  } else {
    // Return true if data passes validation
    return true;
  }
}

// Function to clear the form data
function clearForm() {
  document.querySelector('[name="age"]').value = '';
  document.querySelector('[name="rel"]').value = '';
  document.querySelector('[name="smoker"]').checked = false;
}

// Function to render the household list
function renderHouseholdList() {
  // Refrence the ol element that will hold the list
  var list = document.querySelector('.household');

  // Clear out the list
  list.innerHTML = '';

  // Loop through the household array and add the list item
  household.forEach(function(person, index) {
    // Create a li element for this person's data
    var item = document.createElement('li');
    // Create a button element that will remove this person from the list
    var removeButton = document.createElement('button');

    // Set the li item's text to display the person's data
    item.innerHTML = person.relationship + ', ' + person.age + (person.smoker ? ', Smoker ' : ' ');

    // Set the button's text
    removeButton.innerHTML = 'Remove';

    // Add a click event listener to the remove button
    removeButton.addEventListener('click', function() {
      // Remove person from the household array
      removePerson(index);
    });

    // Add remove button to the list item
    item.appendChild(removeButton);

    // Add the list item to the list
    list.appendChild(item);
  });
}

function onSubmit(e) {
  // Prevent the button from submitting the form
  e.preventDefault();

  // Refrence the element that will output the serialized JSON
  var debug = document.querySelector('.debug');

  // Set the debug text to the serialized JSON
  debug.innerHTML = JSON.stringify(household, null, 2);

  // Make the debug element appear
  debug.style.display = 'block';
}

// Add click event listeners to the add and submit buttons
document.querySelector('button.add').addEventListener('click', addPerson);
document.querySelector('button[type="submit"]').addEventListener('click', onSubmit);
