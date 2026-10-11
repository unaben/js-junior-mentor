# 📝 Step-by-Step Implementation Guide

Follow these instructions to implement the core logic inside `main.js`.

## 1. State Management & DOM Selections

- Declare a global array variable to hold the fetched data:

  `let products = [];`

- Retrieve and store references to the key DOM elements:
  - **Product List Container:** `#product-list`
  - **Search Input:** `#search-input`

## 2. XHR Data Ingestion (`fetchProducts`)

1. Instantiate a new `XMLHttpRequest` object:

   `const xhr = new XMLHttpRequest();`

2. Configure the request:

   `xhr.open('GET', 'https://dummyjson.com/products?limit=12', true);`

3. Handle response ingestion inside `xhr.onload`:
   - Check if `xhr.status >= 200 && xhr.status < 300`.
   - Parse the raw response text using `JSON.parse(xhr.responseText)` and extract `response.products`.
   - Extend each product object with a custom visibility toggle state: `detailsVisible = false`.
   - Assign the array to the global `products` state.
   - Trigger the primary rendering call: `renderProducts(products)`.

## 3. Card Construction & Rendering (`renderProducts`)

Write a function `renderProducts(list)` to render catalog item components.

1. Clear the grid container:

   `productListContainer.innerHTML = '';`

2. If the list is empty:
   - Append an empty state element:

     `<li class="no-results">No products found matching your search.</li>`

   - Exit the function.

3. Loop through each product using a standard `for` loop.

4. Construct the card template HTML containing:
   - Thumbnail image
   - Category tag
   - Title
   - Brand
   - Price
   - Availability badge
   - Expandable extra details (description, SKU, warranty, shipping)
   - Toggle button

5. Set the card class conditionally:
   - `product-card show-details` if `product.detailsVisible === true`
   - `product-card` otherwise

6. Set a `data-id` attribute on each card:

   `<li class="product-card" data-id="${product.id}">`

7. Set the button text conditionally:
   - `"Hide Details"` if `product.detailsVisible === true`
   - `"Show Details"` otherwise

8. Attach a click listener directly to `.toggle-btn` during element creation, using an IIFE closure to pass `product.id` to `handleToggleDetails()`.

9. Append the finished `<li>` card to `#product-list`.

## 4. Details Mutation Handler (`handleToggleDetails`)

Write a function `handleToggleDetails(productId)` to mutate card display state.

1. Iterate through the global `products` array using a `for` loop to find the item where `product.id === productId`.
2. Invert the boolean property:

   `product.detailsVisible = !product.detailsVisible;`

3. Check the current search query from `#search-input`.
4. Re-filter the global `products` array if a search query is active.
5. Call `renderProducts()` to update the UI while preserving the current search context.

## 5. Real-Time Search Pipeline

1. Bind an `input` event listener to `#search-input`.
2. Convert the query value to lowercase:

   `e.target.value.trim().toLowerCase();`

3. Filter global products using a standard `for` loop, checking whether:

   `product.title.toLowerCase().includes(query);`

4. Pass the filtered product array into `renderProducts()`.

## 6. Application Initialization

Invoke `fetchProducts()` at the bottom of `main.js` to begin XHR data ingestion when the page loads.

```javascript
fetchProducts();
```
