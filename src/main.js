// Constants
const API_URL = 'https://retoolapi.dev/U3YZpG/data';

// Utility functions
const createElementWithText = (tag, text) => {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
};

const handleApiResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`);
  }
  return response.json();
};

// API functions
const fetchData = () => fetch(API_URL).then(handleApiResponse);

const postData = (lastName, firstName, payment, industry, location) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lastName, firstName, payment, industry, location })
  }).then(handleApiResponse);
};

const deleteData = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then(handleApiResponse);
};

// DOM manipulation functions
const displayList = (data) => {
  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = ''; // Clear existing rows
  data.forEach((element) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${element.lastName}</td>
      <td>${element.firstName}</td>
      <td>${element.payment}</td>
      <td>${element.industry}</td>
      <td>${element.location}</td>
      <td><button class="btn btn-danger btn-sm" onclick="handleDelete(${element.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
};

const updateList = async () => {
  const data = await fetchData();
  displayList(data);
};

const displayError = (message) => {
  const errorDiv = createElementWithText('div', message);
  errorDiv.style.color = 'red';
  document.body.appendChild(errorDiv);
};

// Event handlers
const handleSubmit = async (event) => {
  event.preventDefault();
  const nameInput = document.getElementById('name');
  const paymentInput = document.getElementById('payment');
  const industryInput = document.getElementById('industry');
  const locationInput = document.getElementById('location');
  
  const [lastName, firstName] = nameInput.value.trim().split(' ');

  if (!lastName || !firstName || !paymentInput.value || !industryInput.value || !locationInput.value) {
    displayError('Please enter all fields correctly');
    return;
  }

  try {
    const data = await postData(lastName, firstName, paymentInput.value, industryInput.value, locationInput.value);
    console.log('Data posted:', data);
    await updateList();
    nameInput.value = ''; // Clear input after successful submission
    paymentInput.value = '';
    industryInput.value = '';
    locationInput.value = '';
  } catch (error) {
    console.error('Error in submit event:', error);
    displayError(error.message);
  }
};

const handleDelete = async (id) => {
  try {
    await deleteData(id);
    await updateList();
  } catch (error) {
    console.error('Error in delete event:', error);
    displayError(error.message);
  }
};

// Attach handleDelete to the window object
window.handleDelete = handleDelete;

// Initialization
const init = async () => {
  try {
    console.log('Initializing application...');
    await updateList();
    const submitButton = document.getElementById('submit');
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
      console.log('Submit button event listener added');
    } else {
      console.warn('Submit button not found');
    }
  } catch (error) {
    console.error('Initialization error:', error);
    displayError('Failed to load initial data');
  }
};

// Start the application when the DOM is ready
document.addEventListener('DOMContentLoaded', init);