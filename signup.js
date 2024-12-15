document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from traditional submission

    // Get the values from the form
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation
    if (newUsername === "" || newPassword === "" || confirmPassword === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Here you would typically send this data to your server to create a new user
    // For this example, we'll just simulate the process
    console.log("New User:", newUsername, "Password:", newPassword);

    // Simulate account creation
    alert("Account created successfully. Please log in.");
    window.location.href = "login.html"; // Redirect to login page
});