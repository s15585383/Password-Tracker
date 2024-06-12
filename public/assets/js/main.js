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
    // Code to parse the JSON data and update the HTML
  }
  