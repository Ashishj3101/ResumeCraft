document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get the username and password from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Perform basic validation (you should enhance this with more robust checks)
    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return;
    }

    // Simulate an authentication process (replace with actual authentication logic)
    // Here, we check against hardcoded credentials for demonstration purposes only
    if (username === "ashish" && password === "ashish123" || username === "mansaf" && password === "mansaf123") {
        // Successful login: set a session item and redirect to index.html
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";
    } else {
        // Failed login
        alert("Invalid username or password.");
    }
});