// $(document).ready(function () {
//   // Fetch initial password data and populate account list
//   fetchPasswordData();

//   // Click event listener for account cards
//   $(".account-card").on("click", function (event) {
//     // Prevent clicks on child elements from bubbling up and triggering card selection
//     if (
//       event.target.classList.contains("show-password-btn") ||
//       event.target.classList.contains("copy-password-btn") ||
//       event.target.classList.contains("edit-password-btn") ||
//       event.target.classList.contains("delete-password-btn")
//     ) {
//       return;
//     }

//     // Handle card selection logic here
//     $(this).addClass("selected").siblings().removeClass("selected");
//   });

//   // Edit Button Click Event
//   $(".edit-password-btn").on("click", function () {
//     const passwordId = $(this).closest(".account-card").data("passwordId");

//     // Open an edit form modal
//     $("#editPasswordModal").modal("show");

//     // Assuming your modal has fields for editing website name, username, and password
//     $.ajax({
//       url: `/passwords/${passwordId}`,
//       method: "GET",
//       success: function (data) {
//         $("#editAppName").val(data.title);
//         $("#editUsername").val(data.username);
//         $("#editPassword").val(""); // Clear password field
//       },
//       error: function (error) {
//         console.error("Error retrieving password details:", error);
//         // Handle errors
//       },
//     });
//   });

//   // Edit Form Submission
//   $("#editForm").submit(function (event) {
//     event.preventDefault(); // Prevent default form submission

//     const passwordId = $("#editPasswordId").val();
//     const appName = $("#editAppName").val();
//     const username = $("#editUsername").val();
//     const password = $("#editPassword").val(); // User-provided new password

//     // Hash the password before sending
//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(password, salt, (err, hash) => {
//         const editedData = {
//           title: appName,
//           username: username,
//           password: hash, // Use the hashed password
//         };

//         $.ajax({
//           url: `/passwords/${passwordId}`,
//           method: "PUT",
//           data: JSON.stringify(editedData),
//           contentType: "application/json; charset=utf-8",
//           success: function (data) {
//             console.log("Password updated successfully!");
//             // Update the account card details
//             updateAccountCard(passwordId, data);
//             $("#editPasswordModal").modal("hide"); // Close the edit modal
//           },
//           error: function (error) {
//             console.error("Error updating password:", error);
//             // Handle errors
//           },
//         });
//       });
//     });
//   });

//   // Delete Button Click Logic
//   $(".delete-password-btn").on("click", function () {
//     const passwordId = $(this).closest(".account-card").data("passwordId");
//     $(".confirm-delete-btn").data("passwordId", passwordId); // Set password ID for confirmation button
//     $("#deleteConfirmationModal").modal("show"); // Show the confirmation modal
//   });

//   // Confirmation Modal - Delete Button Click
//   $(".confirm-delete-btn").on("click", function () {
//     const passwordId = $(this).data("passwordId");

//     $.ajax({
//       url: `/passwords/${passwordId}`,
//       method: "DELETE",
//       success: function (data) {
//         console.log("Password deleted successfully!");
//         // Remove the account card element from the DOM
//         $(`.account-card[data-password-id="${passwordId}"]`).remove();
//       },
//       error: function (error) {
//         console.error("Error deleting password:", error);
//         // Handle errors
//       },
//     });
//   });

//   // Asynchronous function to fetch password data
//   async function fetchPasswordData() {
//     try {
//       const response = await $.ajax({
//         url: "/passwords",
//         method: "GET",
//       });
//       const passwordData = response.data; // Assuming your API response contains an array of password data

//       // Loop through password data and create account cards
//       populateAccountList(passwordData); // Use the separate populateAccountList function
//     } catch (error) {
//       console.error("Error fetching password data:", error);
//       // Handle errors (e.g., display an error message to the user)
//     }
//   }

//   // Function to populate account list with password data
//   function populateAccountList(data) {
//     const accountList = $(".account-card"); // Assuming you have an element to hold account cards
//     accountList.empty(); // Clear existing content

//     data.forEach(function (account) {
//       const appName = account.title;
//       const username = account.username;

//       const accountElement = createAccountElement(appName, username);
//       accountList.parent().append(accountElement);
//     });
//   }

//   // Function to create a single account card element
//   function createAccountElement(appName, username) {
//     const cardTemplate = `
//       <div class="card account-card" data-password-id="<span class="math-inline">\{Math\.random\(\)\.toString\(36\)\.substring\(2, 15\)\}"\>
// <div class\="card\-body"\>
// <h5 class\="card\-title"\></span>{appName}</h5>
//           <p class="card-text">Username: ${username}</p>
//           <input type="password" class="form-control password-field" disabled>
//           <button type="button" class="btn btn-secondary btn-sm show-password-btn">Show Password</button>
//           <button type="button" class="btn btn-secondary btn-sm copy-password-btn" disabled>Copy</button>
//           <button type="button" class="btn btn-info btn-sm edit-password-btn">Edit</button>
//           <button type="button" class="btn btn-danger btn-sm delete-password-btn">Delete</button>
//         </div>
//       </div>
//     `;

//     // Include password visibility/copy functionality within the card element
//     const passwordField = $(cardTemplate).find(".password-field");
//     const showPasswordBtn = $(cardTemplate).find(".show-password-btn");
//     const copyPasswordBtn = $(cardTemplate).find(".copy-password-btn");

//     showPasswordBtn.on("click", function () {
//       togglePasswordVisibility(passwordField, showPasswordBtn, copyPasswordBtn);
//     });

//     copyPasswordBtn.on("click", function () {
//       const password = passwordField.val();
//       navigator.clipboard
//         .writeText(password)
//         .then(() => {
//           console.log("Password copied to clipboard");
//         })
//         .catch((err) => {
//           console.error("Error copying password:", err);
//           // Handle potential errors
//         });
//     });

//     return $(cardTemplate); // Return the jQuery element for the account card
//   }

//   // Function to toggle password visibility and copy functionality
//   function togglePasswordVisibility(
//     passwordField,
//     showPasswordBtn,
//     copyPasswordBtn
//   ) {
//     const isVisible = passwordField.attr("type") === "text";

//     if (isVisible) {
//       passwordField.attr("type", "password");
//       showPasswordBtn.find("i").removeClass("fa-eye-slash").addClass("fa-eye"); // Update icon class
//       copyPasswordBtn.disabled = true;
//     } else {
//       passwordField.attr("type", "text");
//       showPasswordBtn.find("i").removeClass("fa-eye").addClass("fa-eye-slash"); // Update icon class
//       copyPasswordBtn.disabled = false;
//     }
//   }

//   // Function to update account card details after edits
//   function updateAccountCard(passwordId, updatedData) {
//     // Find the account card element with the matching ID
//     const accountCard = $(`.account-card[data-password-id="${passwordId}"]`);

//     // Update the card content with new data
//     accountCard.find(".card-title").text(updatedData.title);
//     accountCard
//       .find(".card-text p:first-child")
//       .text(`Username: ${updatedData.username}`);

//     // Consider visual feedback
//     accountCard.addClass("updated").delay(1000).removeClass("updated"); // Briefly highlight the updated card
//   }

//   function displayErrorMessage(message) {
//     $("#errorMessageModal").find(".modal-body").text(message);
//     $("#errorMessageModal").modal("show");
//   }
// });
// // Example usage in fetchPasswordData function
