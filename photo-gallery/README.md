## 📝 Step-by-Step Implementation Guide

Follow these instructions to implement the core logic inside `main.js`:

### 1. State Management & DOM Selections

- Declare a global array variable to hold the fetched photo data: `let photos = [];`
- Retrieve and store references to key DOM elements:
  - **Photo List Container**: `#photo-list`
  - **Search Input**: `#search-input`

### 2. XHR Data Ingestion (`fetchPhotos`)

- Instantiate a new `XMLHttpRequest` object (`const xhr = new XMLHttpRequest()`).
- Configure the request: `xhr.open('GET', '[https://jsonplaceholder.typicode.com/photos?_limit=12](https://jsonplaceholder.typicode.com/photos?_limit=12)', true)`.
- Handle response ingestion inside `xhr.onload`:
  - Check if `xhr.status >= 200 && xhr.status < 300`.
  - Parse the raw response text using `JSON.parse(xhr.responseText)`.
  - Extend each photo object with a custom visibility state using a standard `for` loop: `photo.detailsVisible = false`.
  - Assign the processed array to global `photos` state.
  - Trigger the primary filter and render function: `renderPhotos()`.

### 3. List Rendering Engine (`renderPhotoList`)

- Write a function `renderPhotoList(list)` to construct gallery item components:
  - Clear the grid container (`photoListContainer.innerHTML = ''`).
  - If `list` is empty, append an empty state element (`<li class="no-results">No photos found matching your search.</li>`) and exit.
  - Loop through each photo using a standard `for` loop:
    - Determine card class: set `photo-card show-details` if `photo.detailsVisible === true`, otherwise `photo-card`.
    - Construct the card markup string containing thumbnail image, album badge, photo title, extra details (Photo ID, Full Image URL link, dimensions), and toggle button.
    - Set a `data-id` attribute on each card (`<li class="photo-card" data-id="${photo.id}">`).
    - Conditionally set button text: `"Hide Details"` if `photo.detailsVisible === true`, otherwise `"Show Details"`.
    - Attach a `click` event listener directly to `.toggle-btn` during element creation passing `photo.id` to `handleToggleDetails()`.
    - Append the finished `<li>` element to `#photo-list`.

### 4. Details Mutation Handler (`handleToggleDetails`)

- Write a function `handleToggleDetails(photoId)` to mutate photo display state:
  - Iterate through global `photos` using a `for` loop to find the item where `photo.id === photoId`.
  - Invert the boolean property: `photo.detailsVisible = !photo.detailsVisible`.
  - Re-run `renderPhotos()` to compute search filtering and update the DOM cleanly.

### 5. Real-Time Search Pipeline (`renderPhotos`)

- Write a function `renderPhotos()` to handle query matching and UI updates:
  - Read input value: `const query = input.value.trim().toLowerCase();`.
  - Create a temporary filtered array `const filtered = [];`.
  - Loop through global `photos` using a `for` loop, checking if `photo.title.toLowerCase().includes(query)`.
  - Push matching items into `filtered`.
  - Pass `filtered` into `renderPhotoList(filtered)`.

### 6. Event Binding & Application Initialization

- Bind an `input` event listener to `#search-input` calling `renderPhotos`.
- Invoke `fetchPhotos()` at the bottom of `main.js` to begin XHR data ingestion on page load.