// ======================================================
// HTML ELEMEK LEKÉRÉSE
// ======================================================

// Irányítószám input
const irszInput = document.getElementById("irsz");

// Kategória gombok
const gombok = document.querySelectorAll("#uzletek button");

// Eredmény szöveg
const eredmeny = document.querySelector("#uzletek p");

// Üzletkártyák tárolója
const uzletContainer = document.querySelectorAll(
  "#uzletek .container > div"
)[2];

// ======================================================
// API ALAPCÍM
// ======================================================

// const apiUrl = "https://info.nytta.hu/web/api/uzletek";
const apiUrl = "https://infonytta.vercel.app/web/api/uzletek/uzlet";

// ======================================================
// AJAX LEKÉRŐ FÜGGVÉNY
// ======================================================

function ajaxLekero(utvonal) {
  const xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    // Sikeres lekérés
    if (this.status == 200) {
      const adatok = JSON.parse(this.responseText);
      console.log("adatok:", adatok);
      renderUzletek(adatok);
    }

    // Nincs találat
    else if (this.status == 404) {
      console.log("Nincs találat!");
    }

    // Egyéb hiba
    else {
      alert("Hiba történt az adatok lekérésekor!");
    }
  };

  xhttp.open("GET", apiUrl + utvonal);

  xhttp.send();
}

ajaxLekero("/osszes");

const renderUzletek = (uzletek) => {
  uzletContainer.innerHTML = "";

  //   uzletek.forEach((uzlet, index) => {
  //     const uzletCard = document.createElement("div");
  //     uzletCard.classList.add("uzlet-card");

  //     uzletCard.innerHTML = `
  //       <h3>${uzlet.nev}</h3>
  //       <p>${uzlet.cim}</p>
  //       <p>${uzlet.irsz}</p>
  //       <p>${uzlet.kategoria}</p>
  //     `;
  // uzletContainer.appendChild(uzletCard);
  //   });

  for (let index = 0; index < uzletek.length; index++) {
    const uzlet = uzletek[index];
    console.log("uzlet:", uzlet);

    const uzletCard = document.createElement("div");
    uzletCard.classList.add("uzlet-card");

    // const img = uzlet.logourl.startsWith('img/') ? uzlet.logourl.replace('img/', 'logok/') : uzlet.logourl;

    const isStartWithImg = uzlet.logourl.startsWith("img/")
    let img = ''

    if(isStartWithImg) {
        img = uzlet.logourl.replace("img/", "logok/");
    } else {
        img = uzlet.logourl;
    }

    console.log("img:", img);

    uzletCard.innerHTML = `
    <img src="${img}" alt="${uzlet.unev}" />
      <h3>${uzlet.unev}</h3>
      <p>${uzlet.cim}</p>
      <p>${uzlet.uzletid}</p>
      <p>${uzlet.funkcio}</p>
    `;

    uzletContainer.appendChild(uzletCard);
  }
};
