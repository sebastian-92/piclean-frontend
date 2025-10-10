// piclean search!
// By Cbass92
// please don't sue me picrew :)
// This code is licensed under the GNU AGPLv3, see LICENSE for details
// You can also find the source code at https://github.com/sebastian-92/piclean-frontend
// infinite scroll based on https://javascript.plainenglish.io/effortless-infinite-scrolling-a-guide-to-dynamic-image-loading-3ff6e7a4a608
const backend = localStorage.getItem("backend") ?? "https://api.piclean.us";
const cdn = localStorage.getItem("cdn") ?? "https://cdn.picrew.me";
const imageContainer = document.getElementById("imageContainer");
const loadingIndicator = document.getElementById("loading");
let page = 1;
let isLoading = false;
function renderImages(images) {
  // render image cards
  images.forEach((image) => {
    const imgDiv = document.createElement("div");
    imgDiv.className = "cell";
    imgDiv.innerHTML = `
      <a href="player.html?id=${image.id}">
        <div class="cell">
            <img class="image is-square" width="200" height="200" src="${image.image}">
            <p>${image.title}</p>
            <p class="author_credit">By ${image.creator}</p>
        </div>
      </a>
    `;
    imageContainer.appendChild(imgDiv);
  });
}
function getQueryString() {
  // build query string from form
  let params = new URLSearchParams(window.location.search);
  params.set("q", document.getElementById("searchInput").value);
  document.title = `Piclean - Search: ${params.get("q")}`;
  params.set("sort", document.getElementById("sort").value);
  params.set("cs", document.getElementById("cs").value);
  params.set("imt", document.getElementById("imt").value);
  params.set("type", document.getElementById("type").value);
  params.set("lang", document.getElementById("lang").value);
  let license = "";
  for (var i = 1; i < 5; i++) {
    license += document.getElementById("license" + i).checked ? "1" : "0";
  }
  params.set("licenses", license);
  return params.toString();
}

function fillFormFromQueryString() {
  // build form from query string on load
  const params = new URLSearchParams(window.location.search);
  if (params.has("qt"))
    document.getElementById("searchInput").value = params.get("qt");
  if (params.has("s")) document.getElementById("sort").value = params.get("s");
  if (params.has("cs")) document.getElementById("cs").value = params.get("cs");
  if (params.has("imt"))
    document.getElementById("imt").value = params.get("imt");
  if (params.has("st"))
    document.getElementById("type").value = params.get("st");
  if (params.has("lang"))
    document.getElementById("lang").value = params.get("lang");
  if (params.has("c")) {
    const license = params.get("c");
    for (let i = 1; i <= 4; i++) {
      document.getElementById("license" + i).checked = license[i - 1] === "1";
    }
  }
  if (params.size > 0) {
    search();
  }
}

// Update query string when any box changes
function updateQueryStringFromForm() {
  const params = new URLSearchParams();
  params.set("qt", document.getElementById("searchInput").value);
  params.set("s", document.getElementById("sort").value);
  params.set("cs", document.getElementById("cs").value);
  params.set("imt", document.getElementById("imt").value);
  params.set("st", document.getElementById("type").value);
  params.set("lang", document.getElementById("lang").value);
  let license = "";
  for (let i = 1; i <= 4; i++) {
    license += document.getElementById("license" + i).checked ? "1" : "0";
  }
  params.set("c", license);
  window.history.replaceState({}, "", "?" + params.toString());
}

// add event listeners to all boxes
["searchInput", "sort", "cs", "imt", "type", "lang"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("change", updateQueryStringFromForm);
});
for (let i = 1; i <= 4; i++) {
  document
    .getElementById("license" + i)
    .addEventListener("change", updateQueryStringFromForm);
}

window.addEventListener("DOMContentLoaded", fillFormFromQueryString);
function search() {
  const qstring = getQueryString();
  imageContainer.innerHTML = ""; // Clear existing images
  page = 1; // Reset to first page
  fetchImages(qstring, page);
}
async function fetchImages(qstring, p) {
  isLoading = true; // Set loading flag to true
  loadingIndicator.style.display = "block"; // Show the loading indicator
  try {
    const response = await fetch(
      `${backend}/search?${getQueryString()}&page=${page}`
    ); // fetch image data
    const images = await response.json(); // Parse JSON response
    renderImages(images.results); // Call renderImages to display images in the DOM
  } catch (error) {
    console.error("Error fetching images:", error);
  } finally {
    setTimeout(() => {
      loadingIndicator.style.display = "none"; // Hide loading indicator
      isLoading = false; // Reset loading flag
    }, 10); // Delay to ensure the loading indicator is visible
  }
}
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
window.addEventListener(
  "scroll",
  debounce(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !isLoading
    ) {
      page++;
      fetchImages(page);
    }
  }, 200)
);
