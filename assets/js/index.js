const API_URL = "https://striveschool-api.herokuapp.com/api/product";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwZDIzNjc4Y2RkZjAwMTU1ZDY3ZmQiLCJpYXQiOjE3NTIyMjQzMTEsImV4cCI6MTc1MzQzMzkxMX0.MUa7xBUE7RqHMHYamY2rPSzBRqGOXnxVH420Wul9e9I";

let allProducts = [];

/* ========== FUNZIONE DI CARICAMENTO PAGINA ========== */
document.addEventListener("DOMContentLoaded", async () => { 
  const container = document.getElementById("productList");
  const notFoundAlert = document.getElementById("notFoundAlert");
  const spinner = document.getElementById("loadingSpinner");
  spinner.classList.remove("d-none");

  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    allProducts = await response.json();
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error retrieving products:", error);
    container.innerHTML = `
      <div class="col">
        <div class="alert alert-danger text-center">
          There are currently no products available.
        </div>
      </div>`;
  } finally {
    spinner.classList.add("d-none");
  }

  /* RICERCA IN TEMPO REALE */
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query)
    );

    if (filtered.length > 0) {
      notFoundAlert.classList.add("d-none");
      displayProducts(filtered);
    } else {
      document.getElementById("productList").innerHTML = "";
      notFoundAlert.classList.remove("d-none");
    }
  });
});

/* ========== FUNZIONE PER VISUALIZZARE I PRODOTTI ========== */
const displayProducts = function(products) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="card bg-white shadow text-black h-100">
        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" style="height: 300px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text fw-bold text-warning">€ ${product.price}</p>
          <a href="details.html?id=${product._id}" class="btn btn-outline-dark mt-auto">Details</a>
          <button class="btn btn-success mt-2">Buy</button>
        </div>
      </div>`;

    container.appendChild(col);
  });
}