const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://kusa-awards-2026-backend.onrender.com";

/* =========================
   GET TOKEN
========================= */
function getToken() {

  const adminToken = localStorage.getItem("adminToken");

  if (adminToken) return adminToken;

  return localStorage.getItem("token");
}

/* =========================
   API REQUEST
========================= */
async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  isForm = false
) {
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
      body: isForm
        ? body
        : body
        ? JSON.stringify(body)
        : null,
    });

    let data;

    try {
      data = await res.json();
    } catch {
      data = {};
    }

    /* =========================
       HANDLE 401
    ========================= */
    if (res.status === 401) {

      console.log("SESSION EXPIRED");

      localStorage.clear();

      if (window.location.pathname.includes("admin")) {
        window.location.href = "/admin/login.html";
      } else {
        window.location.href = "/login.html";
      }

      throw new Error("Session expired");
    }

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;

  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
}
