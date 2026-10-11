# 📝 Step-by-Step Implementation Guide

Follow these instructions to implement the core logic inside `main.js`.

## 1. State Management & DOM Selections

* Declare a global array variable to hold the fetched data:

  ```javascript
  let products = [];
  ```
* Retrieve and store references to key DOM elements:

  * **Product List Container:** `#product-list`
  * **Search Input:** `#search-input`

## 2. XHR Data Ingestion (`fetchProducts`)

* Instantiate a new `XMLHttpRequest` object:

  ```javascript
  const xhr = new XMLHttpRequest();
  ```
* Configure the request:

  ```javascript
  xhr.open('GET', 'https://dummyjson.com/products?limit=12', true);
  ```
* Handle response ingestion inside `xhr.onload`:

  * Check if `xhr.status >= 200 && xhr.status < 300`.
  * Parse the raw response text using `JSON.parse(xhr.responseText)` and extract `response.products`.
  * Extend each product object with a custom visibility toggle state: `detailsVisible = false`.
  * Assign the array to the global `products` state.
  * Trigger the primary rendering call: `renderProducts(products)`.

## 3. Star Rating Formatter (`getStarRating`)

Write a helper function `getStarRating(rating)` that receives a numeric rating score:

* Round the input score using `Math.round(rating)`.
* Loop from `1` to `5` using a standard `for` loop to concatenate `★` for filled stars and `☆` for empty stars.
* Return the formatted star string.

## 4. Card Construction & Rendering (`renderProducts`)

Write a function `renderProducts(list)` to render catalog item components:

* Clear the grid container:

  ```javascript
  productListContainer.innerHTML = '';
  ```
* If `list` is empty:

  * Append an empty state element:

    ```html
    <li class="no-results">No products found matching your search.</li>
    ```
  * Exit the function.
* Loop through each product using a standard `for` loop:

  * Build nested review markup by iterating over `product.reviews` with an inner `for` loop, calling `getStarRating(rev.rating)`.
  * Construct the card template HTML containing:

    * Thumbnail image
    * Category
    * Title
    * Brand
    * Price
    * Availability badge
    * Expandable details (SKU, warranty, shipping, and reviews)
    * Toggle button
  * Set the class to `product-card show-details` if `product.detailsVisible === true`; otherwise, use `product-card`.
  * Set a `data-id` attribute on each card:

    ```html
    <li class="product-card" data-id="${product.id}">
    ```
  * Attach a `click` listener directly to `.toggle-btn` during element creation using an IIFE closure to pass `product.id` to `handleToggleDetails()`.
  * Append the finished `<li>` card to `#product-list`.

## 5. Details & Reviews Mutation Handler (`handleToggleDetails`)

Write a function `handleToggleDetails(productId)` to mutate card display state:

* Iterate through global `products` using a `for` loop to find the item where `product.id === productId`.
* Invert the boolean property:

  ```javascript
  product.detailsVisible = !product.detailsVisible;
  ```
* Check the current search query from `#search-input`.
* Re-filter global `products` if a search query is active.
* Call `renderProducts()` to update the UI while preserving the current search context.

## 6. Real-Time Search Pipeline

* Bind an `input` event listener to `#search-input`.
* Convert the query value to lowercase:

  ```javascript
  e.target.value.trim().toLowerCase();
  ```
* Filter global `products` using a standard `for` loop by checking whether:

  ```javascript
  product.title.toLowerCase().includes(query);
  ```
* Pass the filtered product array into `renderProducts()`.

## 7. Application Initialization

* Invoke `fetchProducts()` at the bottom of `main.js` to begin XHR data ingestion on page load.
