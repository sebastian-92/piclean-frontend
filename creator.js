// creator.js!
// by Cbass92
// please don't sue me picrew :)
// This code is licensed under the GNU AGPLv3, see LICENSE for details
// You can also find the source code at https://github.com/sebastian-92/piclean-frontend

// setup backend and cdn urls
const backend = localStorage.getItem("backend") ?? "https://api.piclean.us";
const cdn = localStorage.getItem("cdn") ?? "https://cdn.picrew.me";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (!id) {
  console.error("No creator id provided");
}
function loadCreator(id, targetElem) {
  fetch(backend + `/creator/${id}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("creator-name").innerText =
        data.results[0].creator;
      var panelhtml = "";
      data.results.slice(0, 8).forEach((item) => {
        panelhtml += `<a href="player.html?id=${item.id}">
        <div class="cell">
            <img class="image is-square" width="200" height="200" src="${
              item.image
            }">
            <p>${item.title}</p>
            <p class="author_credit">By ${item.creator}</p>
            <p class="licenses">${item.licenses.join(", ")}</p>
        </div>
      </a>`;
      });
      document.getElementById(targetElem).innerHTML = panelhtml;
    });
}
loadCreator(id, "crews");
