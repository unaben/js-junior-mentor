# Task: Product Catalogue (XMLHttpRequest, Filters & Toggle)

## 📦 The data

The API returns an array. Each product looks like this:

```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  "price": 109.95,
  "description": "Your perfect pack for everyday use and walks in the forest...",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  "rating": { "rate": 3.9, "count": 120 }
}
```

## 📁 Files provided

| File | What it's for |
|---|---|
| `index.html` | Page skeleton. The list is empty, and your JS fills it. |
| `style.css` | Flexbox layout and card styles, ready to use. |
| `sample.html` | One finished card in a full page. Copy its structure. |
| `index.js` | Your starter file with TODO comments. **This is the only file you edit.** |

## 📝 Step-by-step guide

### 1. State and DOM references
- Declare `let products = [];` to hold the data.
- Select `#product-list`, `#search-input`, `#category-filter` and `#status-message`.

### 2. Get the data with XHR (`fetchProducts`)
- Show "Loading products..." in the status element.
- Create the request: `const xhr = new XMLHttpRequest();`
- Configure it: `xhr.open("GET", API_URL, true);`
- Inside `xhr.onload`:
  - if `xhr.status >= 200 && xhr.status < 300`:
    - parse `xhr.responseText` with `JSON.parse`
    - using a `for` loop, add `detailsVisible = false` to every product
    - save the result in `products` and clear the status message
    - call `buildCategoryOptions()` and `applyFilters()`
  - otherwise, show an error message that includes `xhr.status`
- Inside `xhr.onerror`: show a "network problem" error message.
- Finish with `xhr.send();`

### 3. Build the category dropdown (`buildCategoryOptions`)
- Loop through `products` and collect each category **once** (hint: check your own `categories` array with an inner loop before pushing).
- Add one `<option>` per category after the "All categories" option.

### 4. Render the cards (`renderProducts(list)`)
- Clear the list.
- If `list` is empty, show `<li class="no-results">No products match your filters.</li>` and stop.
- Loop through `list` and build the card markup as in `sample.html`.
- Add the class `show-description` when `detailsVisible` is true.
- Button text is "Hide Description" when `detailsVisible` is true, otherwise "Show Description".
- Put `data-id="${product.id}"` on the button so the click handler knows which product was clicked.

### 5. Toggle handler (`handleToggle(productId)`)
- Loop through `products` to find the matching id.
- Flip `detailsVisible`.
- Call `applyFilters()` so the DOM is redrawn from state.

### 6. Combined filters (`applyFilters`)
- Read the search text (trimmed, lower-case) and the selected category.
- Loop through `products` and push a product into `filtered` only if it matches **both**.
- Pass `filtered` to `renderProducts()`.

### 7. Wire it up
- `input` event on the search box calls `applyFilters`.
- `change` event on the dropdown calls `applyFilters`.
- **One** `click` listener on `#product-list` checks whether `event.target` is a `.toggle-btn`, then calls `handleToggle(Number(event.target.dataset.id))`.
- Call `fetchProducts()` at the bottom of the file.

## ✅ Acceptance checklist

- [ ] 20 product cards appear, each with an image
- [ ] "Loading products..." shows first, then disappears
- [ ] Typing "back" leaves only matching products
- [ ] Choosing "jewelery" shows only jewellery
- [ ] Search and category work together
- [ ] Expand a card, type in the search box, clear it: the card is still expanded
- [ ] Change the URL to `https://fakestoreapi.com/nothing`: you see an error message that includes the status code
- [ ] Turn off your Wi-Fi and refresh: you see a network error message, not a blank page
- [ ] No `fetch`, `async/await`, `try/catch`, `.map()`, `.filter()` or `.forEach()` anywhere

## 🚀 Stretch goals

- Add a "Sort by price (low → high)" dropdown (write your own sort with loops).
- Show "Showing X of 20 products" under the header.
- Add a "Collapse all" button.
- Show a message while the request is still running by using `xhr.onloadstart` and `xhr.onloadend`.

Give it a shot and shout if you hit a blocker! 🛒