<!DOCTYPE html>
<html>
<head>
  <title>Admin Login</title>
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>

<div class="container">
  <div class="card">
    <h2>Admin Login</h2>

    <input type="email" id="email" placeholder="Enter admin email">
    <button onclick="login()">Login</button>

    <p id="error" style="color:red;"></p>
  </div>
</div>

<script src="../js/api.js"></script>

<script src="../js/api.js"></script>

<script>
async function sendOtp() {
  const email = document.getElementById("email").value.trim();

  try {
    const res = await apiRequest(
      "/api/auth/send-otp",
      "POST",
      { email }
    );

    document.getElementById("msg1").innerText =
      res.message;

    document.getElementById("emailBox").style.display = "none";
    document.getElementById("otpBox").style.display = "block";

  } catch (err) {
    document.getElementById("msg1").innerText =
      err.message;
  }
}

async function verifyOtp() {
  const email = document.getElementById("email").value.trim();
  const code = document.getElementById("otp").value.trim();

  try {
    const res = await apiRequest(
      "/api/auth/verify-otp",
      "POST",
      { email, code }
    );

    localStorage.clear();
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    if (res.user.role === "ADMIN") {
      window.location.href = "../admin/dashboard.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } catch (err) {
    document.getElementById("msg2").innerText =
      err.message;
  }
}
</script>

</body>
</html>
