// =========================
// AUTH GUARD
// =========================
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// =========================
// LOAD INIT
// =========================
loadCategories();
loadNominees();
loadCategoryTable();

// =========================
// CREATE CATEGORY
// =========================
async function createCategory() {
  const name = document.getElementById("catName").value;
  const description = document.getElementById("catDesc").value;

  if (!name) return alert("Category name required");

  try {
    await apiRequest("/api/categories", "POST", {
      name,
      description,
    });

    document.getElementById("catMsg").innerText =
      "Category created successfully!";

    document.getElementById("catName").value = "";
    document.getElementById("catDesc").value = "";

    loadCategories();
    loadCategoryTable();
  } catch (err) {
    document.getElementById("catMsg").innerText = err.message;
  }
}

// =========================
// LOAD CATEGORY DROPDOWN
// =========================
async function loadCategories() {
  try {
    const categories = await apiRequest("/api/categories");

    const select = document.getElementById("category");
    select.innerHTML = "";

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.log("Category load failed", err);
  }
}

// =========================
// LOAD CATEGORY TABLE
// =========================
async function loadCategoryTable() {
  try {
    const categories = await apiRequest("/api/categories");

    const table = document.getElementById("categoryTable");
    table.innerHTML = "";

    categories.forEach((cat) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${cat.name}</td>
        <td>${cat.description || "-"}</td>
        <td id="votes-${cat.id}">loading...</td>
        <td>
          <button class="danger" onclick="deleteCategory('${cat.id}')">
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);

      loadCategoryVotes(cat.id);
    });
  } catch (err) {
    console.log("Category table load failed", err);
  }
}

// =========================
// LOAD CATEGORY VOTES
// =========================
async function loadCategoryVotes(categoryId) {
  try {
    const results = await apiRequest(`/api/results/${categoryId}`);

    let totalVotes = 0;

    results.forEach((r) => {
      totalVotes += r.votes;
    });

    const cell = document.getElementById(`votes-${categoryId}`);
    if (cell) cell.innerText = totalVotes;
  } catch (err) {
    const cell = document.getElementById(`votes-${categoryId}`);
    if (cell) cell.innerText = "0";
  }
}

// =========================
// DELETE CATEGORY
// =========================
async function deleteCategory(id) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  try {
    await apiRequest(`/api/categories/${id}`, "DELETE");

    loadCategories();
    loadCategoryTable();
  } catch (err) {
    alert(err.message);
  }
}

// =========================
// ADD NOMINEE
// =========================
async function addNominee() {
  const name = document.getElementById("name").value;
  const categoryId = document.getElementById("category").value;
  const image = document.getElementById("image").files[0];

  if (!name || !categoryId) {
    return alert("Name and category required");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("categoryId", categoryId);
  if (image) formData.append("image", image);

  try {
    await apiRequest("/api/nominees", "POST", formData, true);

    document.getElementById("msg").innerText = "Nominee added!";

    loadNominees();
  } catch (err) {
    document.getElementById("msg").innerText = err.message;
  }
}

// =========================
// LOAD NOMINEES
// =========================
async function loadNominees() {
  try {
    const nominees = await apiRequest("/api/nominees");

    const table = document.getElementById("nomineeTable");
    table.innerHTML = "";

    nominees.forEach((n) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td><img src="${n.image || ""}" width="60"/></td>
        <td>${n.name}</td>
        <td>${n.category?.name || "-"}</td>
        <td>${n.approved ? "✅ Approved" : "❌ Pending"}</td>
        <td>
          <button onclick="approve('${n.id}')">Approve</button>
          <button class="danger" onclick="removeNominee('${n.id}')">Delete</button>
        </td>
      `;

      table.appendChild(row);
    });
  } catch (err) {
    console.log("Nominees load failed", err);
  }
}

// =========================
// APPROVE NOMINEE
// =========================
async function approve(id) {
  try {
    await apiRequest(`/api/nominees/${id}/approve`, "PUT");
    loadNominees();
  } catch (err) {
    alert(err.message);
  }
}

// =========================
// DELETE NOMINEE
// =========================
async function removeNominee(id) {
  if (!confirm("Delete this nominee?")) return;

  try {
    await apiRequest(`/api/nominees/${id}`, "DELETE");
    loadNominees();
  } catch (err) {
    alert(err.message);
  }
}