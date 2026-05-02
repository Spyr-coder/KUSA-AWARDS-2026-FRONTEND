const BASE_URL = "https://kusa-awards-2026-backend.onrender.com/api";

async function apiRequest(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : null,
  });

  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
