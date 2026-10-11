const mainContainer = document.querySelector(".results");
console.log("main:", mainContainer);

const text = document.querySelector(".summary");

function fetchUser() {
  const xh = new XMLHttpRequest();

  xh.open("GET", "https://infonytta.vercel.app/web/api/uzletek/uzlet/osszes");

  xh.onload = function () {
    if (xh.status === 200) {
      const data = JSON.parse(xh.responseText);
      console.log("data: ", data);
      renderList(data);
    }
    if (xh.status === 400) {
      console.log("No data found");
    } else {
      console.log("Network error");
    }
  };

  xh.send();
}
fetchUser();

function renderList(shopList) {
  mainContainer.innerHTML = "";

  if (shopList.length === 0) {
    const li = document.createElement("li");
    li.className = "no-result";
    li.textContent = "No shop found";
    mainContainer.appendChild(li);
  }

  for (let i = 0; i < shopList.length; i++) {
    const shop = shopList[i];

    const articleEl = document.createElement("article");
    articleEl.className = "shop";

    articleEl.innerHTML = `
  <img
  height='100px'
  class="shop-logo"
  src='../${shop.logourl}'
  alt=${shop.unev}
/>
<div class="shop-body">
  <span class="tag">${shop.funkcio}</span>
  <h3>${shop.unev}</h3>
  <p>${shop.cim}</p>
</div>
<div class="shop-side">
  <button type="button" class="info" aria-label="Nyitvatartás">
    i
  </button>
  <dl class="hours">
    <dt>hétfő:</dt>
    <dd>9 - 18</dd>
    <dt>kedd:</dt>
    <dd>9 - 18</dd>
    <dt>szerda:</dt>
    <dd>9 - 18</dd>
    <dt>csütörtök:</dt>
    <dd>9 - 18</dd>
    <dt>péntek:</dt>
    <dd>9 - 18</dd>
  </dl>
</div>
  `;
    mainContainer.append(articleEl);
  }
  text.innerHTML = "";
  text.textContent = `
Keresési eredmény: ${shopList.length} találat
`;
}
