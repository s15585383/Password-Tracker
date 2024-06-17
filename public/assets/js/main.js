$(document).ready(function() {

  // Fetch initial password data and populate account list
  fetchPasswordData();

  // Edit Button Click Event
  $(".edit-password-btn").on("click", function() {
    const passwordId = $(this).closest(".account-card").data("passwordId");

    // Open an edit form modal 
    $("#editPasswordModal").modal("show");


    $.ajax({
      url: `/passwords/${passwordId}`,
      method: "GET",
      success: function(data) {
        $("#editAppName").val(data.title);
        $("#editUsername").val(data.username);
        $("#editPassword").val(""); // Clear password field 
      },
      error: function(error) {
        console.error("Error retrieving password details:", error);
        // Handle errors 
      }
    });
  });

  // Edit Form Submission 
  $("#editForm").submit(function(event) {
    event.preventDefault(); // Prevent default form submission

    const passwordId = $("#editPasswordId").val(); 
    const appName = $("#editAppName").val();
    const username = $("#editUsername").val();
    const password = $("#editPassword").val(); // User-provided new password

    // Hash the password before sending 
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        const editedData = {
          title: appName,
          username: username,
          password: hash, // Use the hashed password
        };

        $.ajax({
          url: `/passwords/${passwordId}`,
          method: "PUT",
          data: JSON.stringify(editedData),
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            console.log("Password updated successfully!");
            // Update the account card details 
            updateAccountCard(passwordId, data);
            $("#editPasswordModal").modal("hide"); // Close the edit modal
          },
          error: function(error) {
            console.error("Error updating password:", error);
            // Handle errors
        }
      });
    });
  });

  // Delete Button Click Logic
  $(".delete-password-btn").on("click", function() {
    const passwordId = $(this).closest(".account-card").data("passwordId");
    $(".confirm-delete-btn").data("passwordId", passwordId); // Set password ID for confirmation button
    $("#deleteConfirmationModal").modal("show"); // Show the confirmation modal
  });

  // Confirmation Modal - Delete Button Click 
  $(".confirm-delete-btn").on("click", function() {
    const passwordId = $(this).data("passwordId");

    $.ajax({
      url: `/passwords/${passwordId}`,
      method: "DELETE",
      success: function(data) {
        console.log("Password deleted successfully!");
        // Remove the account card element from the DOM
        $(`.account-card[data-password-id="${passwordId}"]`).remove();
      },
      error: function(error) {
        console.error("Error deleting password:", error);
        // Handle errors 
      }
    });
  });
});



function populateAccountList(data) {
  const accountList = $(".account-card");
  accountList.empty(); // Clear existing content 

  data.forEach(function(account) {
    const appName = account.title; 
    const username = account.username;

    const accountElement = createAccountElement(appName, username);
    accountList.parent().append(accountElement);
  });
}

function createAccountElement(appName, username) {
  // create the account card element
  // creating the card element with modifications below

  const passwordField = $('<input type="password" class="form-control password-field" disabled>');
  const showPasswordBtn = $('<button type="button" class="btn btn-secondary btn-sm show-password-btn">Show Password</button>');
  const copyPasswordBtn = $('<button type="button" class="btn btn-secondary btn-sm copy-password-btn" disabled>Copy</button>');

  // Append these elements to  existing account card structure
  // append passwordField, showPasswordBtn, copyPasswordBtn

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
$(".edit-password-btn").on("click", function() {
  // Handle edit functionality (e.g., open an edit form)
  const passwordId = $(this).closest(".account-card").data("passwordId");
  console.log("Edit button clicked for password ID:", passwordId);
  // Implement your logic to open an edit form or modal window pre-populated with existing data
});

// Add click event listener for the delete confirmation button
$(".confirm-delete-btn").on("click", function() {
  const passwordId = $(this).data("passwordId");
  console.log("Confirmed deletion for password ID:", passwordId);
  // Implement your logic to delete the password entry from the backend
  // This might involve sending a DELETE request to your API endpoint
  $(this).closest(".modal").modal("hide"); // Hide the confirmation modal
});

// Logic to trigger the confirmation modal when clicking the delete button on an account card
// (assuming you have a delete button implemented)
$(".delete-password-btn").on("click", function() {
  const passwordId = $(this).closest(".account-card").data("passwordId");
  $(".confirm-delete-btn").data("passwordId", passwordId); // Set password ID for confirmation button
  $("#deleteConfirmationModal").modal("show"); // Show the confirmation modal
});
