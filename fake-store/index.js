// console.log('Today is a great day to learn JavaScript!');
// ============================================================
// Product Catalogue: SOLUTION (XMLHttpRequest, no try/catch, for loops only)
// ============================================================

const API_URL = "https://fakestoreapi.com/products";

// 1. STATE
let products = [];

// 1. DOM REFERENCES
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const statusMessage = document.getElementById("status-message");

// Small helper so we don't repeat ourselves
function showError(message) {
  statusMessage.className = "status-message error";
  statusMessage.textContent = message;
}

// 2. GET DATA WITH XHR
function fetchProducts() {
  statusMessage.className = "status-message";
  statusMessage.textContent = "Loading products...";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", API_URL, true);

  // Runs when the server has answered (even with a 404 or 500)
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);

      // add our own UI state to every product
      for (let i = 0; i < data.length; i++) {
        data[i].detailsVisible = false;
      }

      products = data;
      statusMessage.textContent = "";

      buildCategoryOptions();
      applyFilters();
    } else {
      showError(
        "Sorry, we couldn't load the products (status " + xhr.status + ").",
      );
    }
  };

  // Runs when the request never reached the server (e.g. no internet)
  xhr.onerror = function () {
    showError("Network problem: please check your connection and try again.");
  };

  xhr.send();
}

// 3. CATEGORY DROPDOWN
function buildCategoryOptions() {
  const categories = [];

  for (let i = 0; i < products.length; i++) {
    const category = products[i].category;
    const isExisting = categories.includes(category);

    // Only act the first time we see a category
    if (!isExisting) {
      categories.push(category);

      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    }
  }
}
// function buildCategoryOptions() {
//   const categories = [];

//   for (let i = 0; i < products.length; i++) {
//     const category = products[i].category;
//     let alreadyAdded = false;

//     for (let j = 0; j < categories.length; j++) {
//       if (categories[j] === category) {
//         alreadyAdded = true;
//         break;
//       }
//     }

//     if (!alreadyAdded) {
//       categories.push(category);
//     }
//   }

//   for (let k = 0; k < categories.length; k++) {
//     const option = document.createElement("option");
//     option.value = categories[k];
//     option.textContent = categories[k];
//     categoryFilter.appendChild(option);
//   }
// }

// 4. RENDER
function renderProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML =
      '<li class="no-results">No products match your filters.</li>';
    return;
  }

  for (let i = 0; i < list.length; i++) {
    const product = list[i];

    const cardClass = product.detailsVisible
      ? "product-card show-description"
      : "product-card";
    const buttonText = product.detailsVisible
      ? "Hide Description"
      : "Show Description";

    const card = document.createElement("li");
    card.className = cardClass;
    card.setAttribute("data-id", product.id);

    card.innerHTML =
      '<article class="card-inner">' +
      '<div class="card-image-wrap">' +
      '<img class="product-img" src="' +
      product.image +
      '" alt="' +
      product.title +
      '" loading="lazy" />' +
      "</div>" +
      '<div class="card-info">' +
      '<span class="category-tag">' +
      product.category +
      "</span>" +
      '<h2 class="product-title">' +
      product.title +
      "</h2>" +
      '<p class="product-price">$' +
      product.price.toFixed(2) +
      "</p>" +
      '<p class="product-rating">★ ' +
      product.rating.rate +
      " (" +
      product.rating.count +
      " reviews)</p>" +
      "</div>" +
      '<div class="card-details"><p>' +
      product.description +
      "</p></div>" +
      '<button class="toggle-btn" type="button" data-id="' +
      product.id +
      '">' +
      buttonText +
      "</button>" +
      "</article>";

    productList.appendChild(card);
  }
}

// 5. TOGGLE
function handleToggle(productId) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      products[i].detailsVisible = !products[i].detailsVisible;
      break;
    }
  }

  // Redraw from state so the current filters stay applied
  applyFilters();
}

// 6. COMBINED FILTERS
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const filtered = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const matchesSearch = product.title.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    if (matchesSearch && matchesCategory) {
      filtered.push(product);
    }
  }

  renderProducts(filtered);
}

// 7. EVENTS + INIT
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

// Event delegation: ONE listener handles every toggle button,
// even though the buttons are re-created on each render.
productList.addEventListener("click", function (event) {
  if (event.target.classList.contains("toggle-btn")) {
    handleToggle(Number(event.target.dataset.id));
  }
});

fetchProducts();
