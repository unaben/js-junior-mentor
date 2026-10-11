"use strict"; // Makes JavaScript stricter, so common mistakes throw errors

/* =====================================================
   SETTINGS
   ===================================================== */

// The address of the API. Change it if the API runs somewhere else.
// (fallback endpoint: https://info.nytta.hu/web/api/uzletek/uzlet)
const API_BASE = "https://infonytta.vercel.app/web/api/uzletek/uzlet";

// Picture shown when a shop has no logo, or its logo fails to load
const SITE_LOGO = "img/logo.png";

/* =====================================================
   FIND ELEMENTS ON THE PAGE (once, at the start)
   We store them in variables so we don't have to search again later.
   ===================================================== */

// The <header> tag. We add/remove the class "open" to show/hide the mobile menu.
const header = document.querySelector("header");

// The button that opens and closes the mobile menu
const menuToggle = document.querySelector("#menuToggle");

// The postcode input field
const zipInput = document.querySelector("#irsz");

// The text line that says "Keresési eredmény: X találat"
const summary = document.querySelector("#summary");

// The box that holds all the shop cards
const results = document.querySelector("#results");

// ALL the category buttons (Élelmiszer, Zöldséges, ...).
// querySelectorAll gives us a list, so we can loop over it.
const categoryButtons = document.querySelectorAll("#categories button");

// All the links inside the menu
const menuLinks = document.querySelectorAll("nav a");

// Counts how many shop requests we have started.
// If the user clicks quickly, an old (slow) answer could arrive AFTER a newer one.
// We use this number to ignore old answers.
let requestCounter = 0;

// true while a category button is the active filter.
// In that case we do NOT show the category tag on the shop cards,
// because every shop has the same category and it would be repeated.
let categoryFilterActive = false;

/* =====================================================
   MOBILE MENU
   ===================================================== */

// Opens the menu when isOpen is true, closes it when false
function setMenu(isOpen) {
  if (isOpen) {
    header.classList.add("open");
    menuToggle.textContent = "⤫"; // "close" icon
    menuToggle.setAttribute("aria-expanded", "true");
  } else {
    header.classList.remove("open");
    menuToggle.textContent = "≡"; // "menu" icon
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

// Clicking the menu button switches the menu: open -> closed, closed -> open
menuToggle.addEventListener("click", function () {
  const menuIsOpen = header.classList.contains("open");
  setMenu(!menuIsOpen);
});

// Clicking any menu link closes the menu
for (let i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", function () {
    setMenu(false);
  });
}

/* =====================================================
   SMALL HELPER FUNCTIONS
   ===================================================== */

// Removes the "active" class from every category button
function clearActiveButtons() {
  for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].classList.remove("active");
  }
}

// Shows an error message and removes the old shop cards
function showError() {
  summary.textContent = "Hiba történt az adatok lekérdezése közben.";
  results.innerHTML = "";
}

// Reads the message the API sends back with an error (for example with a 404).
// The API may send JSON like {"uzenet": "..."} or plain text, so we handle both.
// TIP: open the browser's Network tab, look at a 404 response and check the
// property name. If it is not "uzenet" or "message", add it below.
function getApiMessage(xhr) {
  try {
    const data = JSON.parse(xhr.responseText); // try to read it as JSON
    if (data.uzenet) {
      return data.uzenet;
    }
    if (data.message) {
      return data.message;
    }
  } catch (error) {
    // The text is not JSON, so we just use it as it is (below)
  }
  return xhr.responseText || "Nincs találat.";
}

// Turns a time from the API into a short text.
// "09:00:00" becomes "9", and "09:30:00" becomes "9:30"
function formatTime(timeText) {
  const parts = timeText.split(":"); // "09:30:00" -> ["09", "30", "00"]
  const hours = Number(parts[0]); // "09" -> 9 (removes the leading zero)
  const minutes = parts[1]; // "30"

  if (minutes === "00") {
    return String(hours); // full hour: just "9"
  }
  return hours + ":" + minutes; // "9:30"
}

/* =====================================================
   MODAL WINDOW
   ===================================================== */

/* ---------- MODAL VERSION (not used, kept for reference) ----------

// Shows a modal window (a popup on top of the page).
// title = text at the top, content = an HTML element to show inside.
// It uses the built-in <dialog> element, so no extra CSS is needed.
function openModal(title, content) {
  // If an old modal is still on the page, remove it first
  const oldModal = document.querySelector("#hoursModal");
  if (oldModal) {
    oldModal.remove();
  }

  // Create the <dialog> element
  const modal = document.createElement("dialog");
  modal.id = "hoursModal";

  // Create the title: <h3>title</h3>
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = title;

  // Create the close button: <button type="button">Bezár</button>
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Bezár";
  closeButton.addEventListener("click", function () {
    modal.close();
  });

  // Put everything inside the modal, then put the modal on the page
  modal.appendChild(modalTitle);
  modal.appendChild(content);
  modal.appendChild(closeButton);
  document.body.appendChild(modal);

  modal.showModal(); // opens it on top of the page and dims the rest
}

---------- END OF MODAL VERSION ---------- */

/* =====================================================
   LOADING SHOPS FROM THE API
   ===================================================== */

// Asks the API for shops and shows them on the page.
// "path" is the end of the URL, for example "/osszes" (all shops).
function loadShops(path) {
  // Give this request its own number. Newer requests get bigger numbers.
  requestCounter = requestCounter + 1;
  const thisRequest = requestCounter;

  // Step 1: create the request and say where to send it
  const xhr = new XMLHttpRequest();
  xhr.open("GET", API_BASE + path);
  xhr.setRequestHeader("Accept", "application/json");

  // Step 2: this function runs when the server has answered
  xhr.onload = function () {
    // A newer request was started after this one, so ignore this old answer
    if (thisRequest !== requestCounter) {
      return;
    }

    if (xhr.status === 200) {
      // Success: turn the JSON text into a JavaScript array and show it
      const shops = JSON.parse(xhr.responseText);
      renderShops(shops);
    } else if (xhr.status === 404) {
      // 404 means "nothing found": show the message sent by the API
      // and remove the old shop cards
      summary.textContent = getApiMessage(xhr);
      results.innerHTML = "";
    } else {
      // Any other status is a real problem
      showError();
    }
  };

  // This function runs if the request could not reach the server at all
  xhr.onerror = function () {
    if (thisRequest !== requestCounter) {
      return;
    }
    showError();
  };

  // Step 3: send the request (nothing happens until we call this)
  xhr.send();
}

/* =====================================================
   SHOWING THE SHOPS
   ===================================================== */

// Builds one card for every shop and puts them on the page.
// Each card looks like this in HTML:
//
// <article class="shop">
//   <img class="shop-logo">
//   <div class="shop-body">
//     <span class="tag"></span>
//     <h3></h3>
//     <p></p>
//   </div>
//   <div class="shop-side">
//     <button class="info">i</button>
//   </div>
// </article>
function renderShops(shops) {
  // Update the text line, e.g. "Keresési eredmény: 3 találat"
  summary.textContent = "Keresési eredmény: " + shops.length + " találat";

  // Remove the old cards
  results.innerHTML = "";

  // Go through the shops one by one
  for (let i = 0; i < shops.length; i++) {
    const shop = shops[i];

    // --- The card itself ---
    const card = document.createElement("article");
    card.className = "shop";

    // --- The logo ---
    const logo = document.createElement("img");
    logo.className = "shop-logo";
    logo.alt = shop.unev;
    if (shop.logourl) {
      logo.src = shop.logourl; // the shop's own logo
    } else {
      logo.src = SITE_LOGO; // default logo
    }
    // If the logo cannot be loaded, show the default logo instead.
    // We clear onerror first so it can't loop forever if the default logo fails too.
    logo.onerror = function () {
      logo.onerror = null;
      logo.src = SITE_LOGO;
    };

    // --- The middle part of the card ---
    const body = document.createElement("div");
    body.className = "shop-body";

    // The category tag (only when we are NOT filtering by category)
    if (!categoryFilterActive) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = shop.funkcio;
      body.appendChild(tag);
    }

    // The shop name
    const name = document.createElement("h3");
    name.textContent = shop.unev;
    body.appendChild(name);

    // The shop address
    const address = document.createElement("p");
    address.textContent = shop.cim;
    body.appendChild(address);

    // --- The right part of the card ---
    const side = document.createElement("div");
    side.className = "shop-side";

    // The "i" button that shows the opening hours
    const infoButton = document.createElement("button");
    infoButton.type = "button";
    infoButton.className = "info";
    infoButton.textContent = "i";
    infoButton.id = shop.uzletid; // the shop's id, as the task requires
    infoButton.setAttribute("aria-label", "Nyitvatartás");

    // When the button is clicked, load the opening hours of THIS shop
    infoButton.addEventListener("click", function () {
      showOpeningHours(shop.uzletid, infoButton);
      // Modal version (see the commented code below): showOpeningHours(shop.uzletid, shop.unev);
    });
    side.appendChild(infoButton);

    // --- Put the parts inside the card, then put the card on the page ---
    card.appendChild(logo);
    card.appendChild(body);
    card.appendChild(side);
    results.appendChild(card);
  }
}

/* =====================================================
   OPENING HOURS
   ===================================================== */

// Loads the opening hours of one shop and shows them in the card,
// in the place of the "i" button (this matches the screenshot).
// shopId = the id of the shop, infoButton = the "i" button that was clicked
function showOpeningHours(shopId, infoButton) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", API_BASE + "/nyitvatartas/" + encodeURIComponent(shopId));
  xhr.setRequestHeader("Accept", "application/json");

  // Runs when the server has answered
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      let rows = []; // start with "no data"
      if (Array.isArray(data)) {
        rows = data; // the API sent a list directly
      } else if (data.nyitvatartas) {
        rows = data.nyitvatartas; // the list is inside a "nyitvatartas" property
      }
      // Swap the button for the opening hours list
      infoButton.replaceWith(buildHours(rows));
    } else if (xhr.status === 404) {
      // 404: show the message sent by the API in the place of the button
      showHoursMessage(infoButton, getApiMessage(xhr));
    } else {
      showHoursMessage(infoButton, "Hiba történt az adatok lekérdezése közben.");
    }
  };

  // Runs if the server could not be reached
  xhr.onerror = function () {
    showHoursMessage(infoButton, "Hiba történt az adatok lekérdezése közben.");
  };

  xhr.send();
}

// Replaces the "i" button with a short text message
function showHoursMessage(infoButton, message) {
  const text = document.createElement("span");
  text.className = "no-hours";
  text.textContent = message;
  infoButton.replaceWith(text);
}

/* ---------- MODAL VERSION (not used, kept for reference) ----------

// Loads the opening hours of one shop and shows them in a modal window.
// shopId = the id of the shop, shopName = its name (used as the modal title)
function showOpeningHours(shopId, shopName) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", API_BASE + "/nyitvatartas/" + encodeURIComponent(shopId));
  xhr.setRequestHeader("Accept", "application/json");

  // Runs when the server has answered
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      let rows = []; // start with "no data"
      if (Array.isArray(data)) {
        rows = data; // the API sent a list directly
      } else if (data.nyitvatartas) {
        rows = data.nyitvatartas; // the list is inside a "nyitvatartas" property
      }
      openModal(shopName, buildHours(rows));
    } else if (xhr.status === 404) {
      // 404: show the message sent by the API inside the modal
      showModalMessage(shopName, getApiMessage(xhr));
    } else {
      showModalMessage(shopName, "Hiba történt az adatok lekérdezése közben.");
    }
  };

  // Runs if the server could not be reached
  xhr.onerror = function () {
    showModalMessage(shopName, "Hiba történt az adatok lekérdezése közben.");
  };

  xhr.send();
}

// Opens a modal that only contains a short text message
function showModalMessage(title, message) {
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  openModal(title, paragraph);
}

---------- END OF MODAL VERSION ---------- */

// Creates the opening hours list from an array of rows.
// Each row looks like: { nap: "hétfő", nyitas: "09:00:00", zaras: "18:00:00" }
function buildHours(rows) {
  // No rows: return a small "no data" message instead
  if (rows.length === 0) {
    const message = document.createElement("span");
    message.className = "no-hours";
    message.textContent = "Nincs nyitvatartási adat";
    return message;
  }

  // <dl> is a list of pairs: <dt> = the day, <dd> = the hours
  const list = document.createElement("dl");
  list.className = "hours";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // The day, e.g. <dt>hétfő:</dt>
    const day = document.createElement("dt");
    day.textContent = row.nap + ":";

    // The hours, e.g. <dd>9 - 18</dd>
    const hours = document.createElement("dd");
    hours.textContent = formatTime(row.nyitas) + " - " + formatTime(row.zaras);

    list.appendChild(day);
    list.appendChild(hours);
  }

  return list;
}

/* =====================================================
   FILTERS
   ===================================================== */

// Runs when the user has finished typing a postcode (Enter or leaving the field)
function filterByZip() {
  const value = zipInput.value.trim(); // remove spaces around the text

  // We are not filtering by category now, so the category tag is shown again
  categoryFilterActive = false;

  // The category filter is not used now, so highlight "Összes" (all).
  // That is the button with an empty data-funkcio.
  clearActiveButtons();
  for (let i = 0; i < categoryButtons.length; i++) {
    if (categoryButtons[i].getAttribute("data-funkcio") === "") {
      categoryButtons[i].classList.add("active");
    }
  }

  // Empty field: show all shops
  if (value === "") {
    loadShops("/osszes");
    return;
  }

  // Check that the postcode is a number between 1000 and 1239
  const zip = parseInt(value, 10);
  if (isNaN(zip) || zip < 1000 || zip > 1239) {
    summary.textContent = "Az irányítószám 1000 és 1239 között legyen!";
    return; // stop here, do not ask the API
  }

  loadShops("/irsz/" + encodeURIComponent(zip));
}

// Runs when a category button is clicked.
// "button" is the button that was clicked.
function filterByCategory(button) {
  // Read the category name from the HTML: <button data-funkcio="Élelmiszer">
  const category = button.getAttribute("data-funkcio");

  // Highlight only the clicked button
  clearActiveButtons();
  button.classList.add("active");

  // Clear the postcode field, because we are filtering by category now
  zipInput.value = "";

  // "Összes" (empty category) is not a real category filter, the others are
  categoryFilterActive = category !== "";

  if (category === "") {
    // The "Összes" button has an empty category: show all shops
    loadShops("/osszes");
  } else {
    loadShops("/funkcio/" + encodeURIComponent(category));
  }
}

// Connect the postcode field: "change" fires on Enter or when the field loses focus
zipInput.addEventListener("change", filterByZip);

// Connect every category button
for (let i = 0; i < categoryButtons.length; i++) {
  // "const" inside the loop body gives each button its own variable
  const button = categoryButtons[i];
  button.addEventListener("click", function () {
    filterByCategory(button);
  });
}

/* =====================================================
   FIRST LOAD
   ===================================================== */

// The static HTML is visible first, then we load all shops from the API
loadShops("/osszes");