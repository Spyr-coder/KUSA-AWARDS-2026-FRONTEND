const BASE_URL = "https://kusa-awards-2026-backend.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(endpoint, method = "GET", body = null, isForm = false) {
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
}
