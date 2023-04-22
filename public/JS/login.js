const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = data.redirectUrl;
    } else {
      errorMessage.innerText = data.error;
    }
  } catch (error) {
    console.error(error);
    errorMessage.innerText =
      "An error occurred while logging in. Please try again later.";
  }
});
