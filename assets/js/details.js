const API_URL = "https://striveschool-api.herokuapp.com/api/product";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwZDIzNjc4Y2RkZjAwMTU1ZDY3ZmQiLCJpYXQiOjE3NTIyMjQzMTEsImV4cCI6MTc1MzQzMzkxMX0.MUa7xBUE7RqHMHYamY2rPSzBRqGOXnxVH420Wul9e9I";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const container = document.getElementById("productDetails");

/* ========== FUNZIONE CARICAMENTO PRODOTTO ========== */
async function loadProductDetails() {
  if (!productId) {
    container.innerHTML =
      '<div class="alert alert-danger">Product ID not find.</div>';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}`},
    });

    if (!res.ok) throw new Error("Error retrieving the product.");

    const p = await res.json();
    document.title = `${p.name}`;

    container.innerHTML = `
          <div class="col-md-10">
            <div class="card shadow p-3">
              <div class="row g-0 align-items-center">
                <div class="col-md-5">
                    <img src="${p.imageUrl}" alt="${p.name}" class="img-fluid rounded" style="width: 100%; height: 500px;" />
                </div>
                <div class="col-md-7">
                  <div class="card-body">
                    <h2 class="card-title">${p.name}</h2>
                    <h5 class="text-muted">${p.brand}</h5>
                    <p class="mt-3">${p.description}</p>
                    <p class="fw-bold text-warning h4">€ ${p.price}</p>
                    <button class="btn btn-success mt-3" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<div class="alert alert-danger">Product not found or network error.</div>';
  }
}

loadProductDetails();

function confirmPurchase() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('buyModal'));
  modal.hide();

  alert("Purchase confirmed! Thank you for choosing Guitar Store. 🎸");
}