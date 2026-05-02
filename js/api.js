const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://kusa-awards-2026-backend.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(endpoint, method = "GET", body = null, isForm = false) {
  try {
    const headers = {};

    if (!isForm) {
      headers["Content-Type"] = "application/json";
    }

    const token = getToken();
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(BASE_URL + endpoint, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;

  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
}
