$(document).ready(function() {
    // Fetch initial password data and populate account list
    fetchPasswordData();
  
    // Click event listener for account cards
    $(".account-card").on("click", function() {
      const passwordId = $(this).data("passwordId");
      const passwordField = $(this).find(".password-field");
      const showPasswordBtn = $(this).find(".show-password-btn");
      const copyPasswordBtn = $(this).find(".copy-password-btn");
  
      // Toggle password visibility and button states based on current state
      togglePasswordVisibility(passwordField, showPasswordBtn, copyPasswordBtn);
  
      // Existing logic to retrieve password details if needed (assuming you have this)
      // getPasswordDetails(passwordId)
      //   .then(data => {
      //     // Update password field value (if not pre-populated)
      //   })
      //   .catch(error => {
      //     console.error("Error retrieving password details:", error);
      //   });
    });
  });
  
  function fetchPasswordData() {
    $.ajax({
      url: "/passwords", // Assuming your endpoint for retrieving all passwords
      method: "GET",
      success: function(data) {
        populateAccountList(data);
      },
      error: function(error) {
        console.error("Error retrieving passwords:", error);
        // Handle errors (e.g., display an error message)
      }
    });
  }
  
  function populateAccountList(data) {
    const accountList = $(".account-card");
    accountList.empty(); // Clear existing content (optional)
  
    data.forEach(function(account) {
      const appName = account.title; // Assuming title represents the application name
      const username = account.username;
  
      const accountElement = createAccountElement(appName, username);
      accountList.parent().append(accountElement);
    });
  }
  
  function getPasswordDetails(passwordId) {
    $.ajax({
      url: `/passwords/${passwordId}`, // Assuming endpoint for specific password
      method: "GET",
      success: function(data) {
        displayPasswordInfo(data); // Assuming this function still updates visuals (username might be needed)
      },
      error: function(error) {
        console.error("Error retrieving password details:", error);
        // Handle errors (e.g., display an error message)
      }
    });
  }
  
  function displayPasswordInfo(data) {
    // Update username or other info in your existing implementation (if needed)
  }
  
  function createAccountElement(appName, username) {
    // Assuming your existing logic to create the account card element
    // ... your code for creating the card element with modifications below
  
    const passwordField = $('<input type="password" class="form-control password-field" disabled>');
    const showPasswordBtn = $('<button type="button" class="btn btn-secondary btn-sm show-password-btn">Show Password</button>');
    const copyPasswordBtn = $('<button type="button" class="btn btn-secondary btn-sm copy-password-btn" disabled>Copy</button>');
  
    // Append these elements to your existing account card structure
    // ... append passwordField, showPasswordBtn, copyPasswordBtn to your card element
    
    return accountElement; // Assuming you return the modified card element
  }
  
  function togglePasswordVisibility(passwordField, showPasswordBtn, copyPasswordBtn) {
    const isVisible = passwordField.attr("type") === "text";
  
    if (isVisible) {
      passwordField.attr("type", "password");
      showPasswordBtn.find("i").removeClass("fa-eye-slash").addClass("fa-eye"); // Update icon class
      copyPasswordBtn.disabled = true;
    } else {
      passwordField.attr("type", "text");
      showPasswordBtn.find("i").removeClass("fa-eye").addClass("fa-eye-slash"); // Update icon class
      copyPasswordBtn.disabled = false;
    }
  }
  
  
  // Remember to include and configure the clipboard.js library for secure clipboard access
  
  $(document).ready(function() {
    // ... rest of the code ...
  
    $(document).ready(function() {
      // Add event listener for copy button click
      $(".copy-password-btn").on("click", function() {
        const passwordField = $(this).closest(".account-card").find(".password-field");
        const password = passwordField.val();
  
        // Use clipboard.js for secure clipboard access
        navigator.clipboard.writeText(password)
          .then(() => {
            console.log("Password copied to clipboard");
          })
          .catch(err => {
            console.error("Error copying password:", err);
            // Handle potential errors (e.g., clipboard permissions)
          });
      });
    });
  });
  