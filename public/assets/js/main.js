$(document).ready(function() {
    // Fetch initial password data and populate account list
    fetchPasswordData();
  
    // Click event listener for account cards
    $(".account-card").on("click", function() {
      const passwordId = $(this).data("passwordId");
      getPasswordDetails(passwordId);
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
        displayPasswordInfo(data);
      },
      error: function(error) {
        console.error("Error retrieving password details:", error);
        // Handle errors (e.g., display an error message)
      }
    });
  }
  
  function displayPasswordInfo(data) {
    const username = data.username;
    const password = data.password; // Assuming password property exists
    
    $("#password-info").show(); // Show the password info element
    $("#selected-account").text(data.title || data.appName); // Update selected account text
    $("#username").text(username);
    $("#password").text(password);
  }
  

//   This function should take the appName and username as arguments and return the corresponding HTML element representing that account
function createAccountElement(appName, username) {
    const tableRow = $('<tr>');
    const appNameCell = $('<td>').text(appName);
    const usernameCell = $('<td>').text(username);
    
    tableRow.append(appNameCell, usernameCell);
    return tableRow;
  }
  
  