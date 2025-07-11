const API_URL = "https://striveschool-api.herokuapp.com/api/product";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwZDIzNjc4Y2RkZjAwMTU1ZDY3ZmQiLCJpYXQiOjE3NTIyMjQzMTEsImV4cCI6MTc1MzQzMzkxMX0.MUa7xBUE7RqHMHYamY2rPSzBRqGOXnxVH420Wul9e9I";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${AUTH_TOKEN}`,
};

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

/* ========== FUNZIONE ALLERT ========== */
const alertContainer = document.getElementById("alertContainer");

const showAlert = function(message, type = "danger", timeout = 5000) {
  alertContainer.innerHTML = `
          <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;

  if (timeout) {
    setTimeout(() => {
      alertContainer.innerHTML = "";
    }, timeout);
  }
}

/* ALLERT MODALI */
const showConfirmModal = function(message, onConfirm) {
  const modalBody = document.getElementById("confirmModalBody");
  const confirmBtn = document.getElementById("confirmModalBtn");

  modalBody.textContent = message;

  const bsModal = new bootstrap.Modal(document.getElementById("confirmModal"));
  bsModal.show();

  const handler = () => {onConfirm(); bsModal.hide(); confirmBtn.removeEventListener("click", handler);};

  confirmBtn.addEventListener("click", handler);
}

/* ========== FUNZIONI NEL FORM ========== */
async function fetchProducts() {
  const res = await fetch(API_URL, { headers });
  const products = await res.json();
  productList.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-dark btn-sm me-2";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editProduct(p));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteProduct(p._id));

    card.innerHTML = `
        <div class="card bg-white text-black shadow h-100">
        <img src="${p.imageUrl}" class="card-img-top" style="height: 300px; object-fit: cover;">

        <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p>${p.description}</p>
            <p class="fw-bold text-warning">€${p.price}</p>
            <div class="d-flex">
            </div>
        </div>
        </div>`;

    const btnContainer = card.querySelector(".d-flex");
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    productList.appendChild(card);
  });
}

/* FUNZIONE DI SALVATAGGIO */
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const brand = document.getElementById("brand").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const price = document.getElementById("price").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name || !brand || !imageUrl || !price || !description) {
    showAlert("All fields are mandatory!", "warning");
    return;
  }

  const product = {name, brand, imageUrl, price: parseFloat(price), description,};

  const id = document.getElementById("productId").value;
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  const res = await fetch(url, {method, headers, body: JSON.stringify(product),});

  if (res.ok) {
    productForm.reset();
    document.getElementById("productId").value = "";

    fetchProducts();
  } else {
    showAlert("Unable to save!", "danger");
  }
});

/* FUNZIONE DI RESET */
const resetForm = function() {
  showConfirmModal("Warning: Resetting is in progress!", () => {
    try {
      productForm.reset();
      document.getElementById("productId").value = "";
      const alertContainer = document.querySelector(".alert-container");
      if (alertContainer) alertContainer.innerHTML = "";
    } catch (err) {
      showAlert("Unable to reset", "danger");
      console.error(err);
    }
  });
}

/* ========== FUNZIONI PRESENTI NELLA CARD ========== */
/* FUNZIONE DI EDIT */
const editProduct = function(p) {
  document.getElementById("name").value = p.name;
  document.getElementById("brand").value = p.brand;
  document.getElementById("imageUrl").value = p.imageUrl;
  document.getElementById("price").value = p.price;
  document.getElementById("description").value = p.description;
  document.getElementById("productId").value = p._id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* FUNZIONE DI DELETE */
const deleteProduct = function(id) {
  showConfirmModal("Warning: You are deleting the product!", async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers,});

      if (res.ok) {
        fetchProducts();
      } else {
        showAlert("Unable to delete!", "danger");
      }
    } catch (err) {
      showAlert("Network error while deleting the product!", "danger");
    }
  });
}

fetchProducts();