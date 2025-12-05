// piclean main page!
// by Cbass92
// please don't sue me picrew :)
// This code is licensed under the GNU AGPLv3, see LICENSE for details
// You can also find the source code at https://github.com/sebastian-92/piclean-frontend

// setup backend and cdn urls
const backend = localStorage.getItem("backend") ?? "https://api.piclean.us";
const cdn = localStorage.getItem("cdn") ?? "https://cdn.picrew.me";
function loadDiscover() {
  fetch(backend + "/discovery?lang=en&page=1&per_page=8")
    .then((response) => response.json())
    .then((data) => {
      var panelhtml = "";
      data.forEach((item) => {
        panelhtml += `<div class="cell"><a href="player.html?id=${item.id}"><img src="${cdn}/${item.thumb}" class="responsive-thumb" alt="${item.title}"></a></div>`;
      });
      document.getElementById("discover-panel").innerHTML = panelhtml;
    });
}
// loads the hot and new panels
function loadSort(type, targetElem) {
  fetch(backend + `/search?sort=${type}`)
    .then((response) => response.json())
    .then((data) => {
      var panelhtml = "";
      data.results.slice(0, 8).forEach((item) => {
        panelhtml += `<a href="player.html?id=${item.id}">
        <div class="cell">
            <img class="responsive-thumb" src="${item.image}" alt="${item.title}">
            <p>${item.title}</p>
            <p class="author_credit">By ${item.creator}</p>
            <p class="licenses">${item.licenses.join(", ")}</p>
        </div>
      </a>`;
      });
      document.getElementById(targetElem).innerHTML = panelhtml;
    });
}
loadSort("1", "new");
loadSort("2", "hot");
loadDiscover();
