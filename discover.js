// infinite scroll
// based on https://javascript.plainenglish.io/effortless-infinite-scrolling-a-guide-to-dynamic-image-loading-3ff6e7a4a608
const backend = localStorage.getItem("backend") ?? "https://api.piclean.us";
const cdn = localStorage.getItem("cdn") ?? "https://cdn.picrew.me";
const imageContainer = document.getElementById("imageContainer");
const loadingIndicator = document.getElementById("loading");
let page = 1;
const limit = 30;
let isLoading = false;
function renderImages(images) {
  images.forEach((image) => {
    const imgDiv = document.createElement("div");
    imgDiv.className = "cell";
    imgDiv.innerHTML = `
      <a href="player.html?id=${image.id}">
        <div class="cell">
            <img class="image is-square" width="200" height="200" src="${cdn + '/' +image.thumb}">
        </div>
      </a>
    `;
    imageContainer.appendChild(imgDiv);
  });
}
async function fetchImages(page, limit) {
  isLoading = true; // Set loading flag to true
  loadingIndicator.style.display = "block"; // Show the loading indicator
  try {
    const response = await fetch(
      `${backend}/discovery?lang=en&page=${page}&per_page=${limit}`
    ); // fetch image data
    const images = await response.json(); // Parse JSON response
    renderImages(images); // Call renderImages to display images in the DOM
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
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
window.addEventListener('scroll', debounce(() => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
    page++;
    fetchImages(page, limit);
  }
}, 200));
fetchImages(page, limit); // Initial fetch on page load