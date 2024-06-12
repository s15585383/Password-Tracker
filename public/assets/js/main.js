$(document).ready(function() {
    $.ajax({
      url: "YOUR_API_ENDPOINT_URL", 
      type: "GET",
      beforeSend: function(xhr) {
        // Set authorization header if needed
        xhr.setRequestHeader("Authorization", `Bearer ${YOUR_JWT_TOKEN}`); // Replace with a way to access the user's JWT token
      },
      success: function(data) {
        populateAccountList(data); // Function to populate the account list with retrieved data
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error retrieving passwords:", textStatus, errorThrown);
        // Handle errors appropriately (e.g., display an error message to the user)
      }
    });
  });
  function populateAccountList(data) {
    const accountList = $(".account-card"); // Select all elements with class "account-card"
    accountList.empty(); // Clear existing content (optional)
    
    data.forEach(function(account) {
      const appName = account.title; // Assuming title represents the application name
      const username = account.username;
      
      const accountElement = createAccountElement(appName, username);
      accountList.parent().append(accountElement);
    });
  }
  

//   This function should take the appName and username as arguments and return the corresponding HTML element representing that account
function createAccountElement(appName, username) {
    const tableRow = $('<tr>');
    const appNameCell = $('<td>').text(appName);
    const usernameCell = $('<td>').text(username);
    
    tableRow.append(appNameCell, usernameCell);
    return tableRow;
  }
  
  