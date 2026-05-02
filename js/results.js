// protect route
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

let categories = [];
let votingOpen = true;

// ==========================
// LOAD SYSTEM STATUS
// ==========================
async function loadSettings() {
  try {
    const data = await apiRequest("/api/admin/analytics/stats");

    votingOpen = data.votingOpen;

    if (votingOpen) {
      document.getElementById("msg").innerText =
        "⚠️ Close voting before selecting winners.";
    }

  } catch (err) {
    console.log("Settings load failed", err);
  }
}

// ==========================
// LOAD CATEGORIES
// ==========================
async function loadCategories() {
  try {
    categories = await apiRequest("/api/categories");

    const select = document.getElementById("category");
    select.innerHTML = "";

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });

    if (categories.length > 0) {
      loadResults();
    }

  } catch (err) {
    alert("Failed to load categories");
  }
}

// ==========================
// LOAD RESULTS
// ==========================
async function loadResults() {
  const categoryId = document.getElementById("category").value;

  if (!categoryId) return;

  try {
    const results = await apiRequest(`/api/results/${categoryId}`);

    const table = document.getElementById("resultsTable");
    table.innerHTML = "";

    if (results.length === 0) {
      table.innerHTML = "<tr><td colspan='4'>No votes yet</td></tr>";
      return;
    }

    results.forEach((r, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${r.nominee?.name || "-"}</td>
        <td>${r.votes}</td>
        <td>
          <button 
            onclick="setWinner('${categoryId}', '${r.nominee?.id}')"
            ${votingOpen ? "disabled" : ""}
          >
            Set Winner
          </button>
        </td>
      `;

      table.appendChild(row);
    });

  } catch (err) {
    alert(err.message);
  }
}

// ==========================
// SET WINNER
// ==========================
async function setWinner(categoryId, nomineeId) {
  if (votingOpen) {
    alert("Close voting before selecting winners.");
    return;
  }

  if (!confirm("Set this nominee as winner?")) return;

  try {
    await apiRequest("/api/admin/winner", "POST", {
      categoryId,
      nomineeId
    });

    document.getElementById("msg").innerText =
      "🏆 Winner set successfully!";

  } catch (err) {
    document.getElementById("msg").innerText = err.message;
  }
}

// ==========================
// BACK BUTTON
// ==========================
function goBack() {
  window.location.href = "dashboard.html";
}

// ==========================
// INIT
// ==========================
loadSettings();
loadCategories();