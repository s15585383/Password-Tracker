const errorMessageEl = document.getElementById('error-message');

const registerForm = document.querySelector('#register-form');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    errorMessageEl.textContent = errorData.message || "Registration failed"; // Display error message or generic message
  } else {
    // Handle successful registration 
    console.log("Registration successful!");
    // redirect the user to the login page or display a success message
  }
});
