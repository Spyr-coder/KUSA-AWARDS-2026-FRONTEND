// protect route
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

let currentVoting = false;
let currentNominations = false;

// load current settings from dashboard stats
async function loadStatus() {
  try {
    const data = await apiRequest("/api/admin/analytics/stats");

    currentVoting = data.votingOpen;
    currentNominations = data.nominationsOpen;

    document.getElementById("votingStatus").innerText =
      currentVoting ? "🟢 OPEN" : "🔴 CLOSED";

    document.getElementById("nominationsStatus").innerText =
      currentNominations ? "🟢 OPEN" : "🔴 CLOSED";

  } catch (err) {
    alert("Failed to load status");
  }
}

// update voting only
async function setVoting(state) {
  try {
    await apiRequest("/api/admin/settings", "PUT", {
      votingOpen: state,
      nominationsOpen: currentNominations
    });

    document.getElementById("msg").innerText = "Voting updated!";
    loadStatus();

  } catch (err) {
    document.getElementById("msg").innerText = err.message;
  }
}

// update nominations only
async function setNominations(state) {
  try {
    await apiRequest("/api/admin/settings", "PUT", {
      votingOpen: currentVoting,
      nominationsOpen: state
    });

    document.getElementById("msg").innerText = "Nominations updated!";
    loadStatus();

  } catch (err) {
    document.getElementById("msg").innerText = err.message;
  }
}

function goBack() {
  window.location.href = "dashboard.html";
}

// init
loadStatus();