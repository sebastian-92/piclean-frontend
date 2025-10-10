// piclean player!
// by Cbass92
// please don't sue me picrew :)
// This code is licensed under the GNU AGPLv3, see LICENSE for details
// You can also find the source code at https://github.com/sebastian-92/piclean-frontend
const urlParams = new URLSearchParams(window.location.search);
const makerId = urlParams.get("id");
const backend = localStorage.getItem("backend") ?? "https://api.piclean.us";
// i really dislike cors >:(
const cdn = localStorage.getItem("cdn") ?? "https://cdn.picrew.me";
console.log("Using backend:", backend);
console.log("Using cdn:", cdn);
function deselectRadios(groupName) {
  const radioButtons = document.getElementsByName(groupName);
  radioButtons.forEach((radio) => {
    radio.checked = false;
  });

  render();
}
function loadById(id) {
  fetch(backend + "/idata/" + String(id))
    .then((res) => res.json())
    .then((data) => {
      const info = document.getElementById("info");
      // this constructs the info box popup
      document.title = `Piclean - ${data.imageMakerInfo.title}`;
      info.innerHTML = `
        <h1 class='title'>${data.imageMakerInfo.title}</h1>
        <img class='desc_thumb' src='${
          data.imageMakerInfo.icon_url
        }' style="max-width:90%;max-height:300px;margin:10px 0;border-radius:10px;" />
        <a class='author_credit' href="creator.html?id=${data.imageMakerInfo.creator_id}">By ${data.imageMakerInfo.creator_name}</a>
        <p class='description'>${data.imageMakerInfo.description_html}</p>
        <h3 class='license_header'>License</h3>
        <table class='license_table'>
          <tr>
        <th>Type</th>
        <th>Allowed</th>
          </tr>
          <tr>
        <td>Personal Use</td>
        <td><input onclick="return false" type="checkbox" ${
          data.imageMakerInfo.can_personal_use ? "checked" : ""
        }></td>
          </tr>
          <tr>
        <td>Non-Commercial Use</td>
        <td><input onclick="return false" type="checkbox" ${
          data.imageMakerInfo.can_non_commercial_use ? "checked" : ""
        }></td>
          </tr>
          <tr>
        <td>Commercial Use</td>
        <td><input onclick="return false" type="checkbox" ${
          data.imageMakerInfo.can_commercial_use ? "checked" : ""
        }></td>
          </tr>
          <tr>
        <td>Derivative Works</td>
        <td><input onclick="return false" type="checkbox" ${
          data.imageMakerInfo.can_derivative_works ? "checked" : ""
        }></td>
          </tr>
        </table>
        `;
      // construct main canvas
      let newmain = `
        <canvas id="c" width="${data.config.w}" height="${data.config.h}" style="border:1px solid #000000;"></canvas>
        `;
      let newselector = "";
      for (const i of data.config.pList) {
        if (i.isMenu) {
          // menu items are displayed in picrew
          newselector += `<div class="radio-section"><img loading="lazy" src='https://cdn.picrew.me${
            i.thumbUrl
          }' class="section-thumb"><br><p>${
            i.pNm
          }</p><button onclick="deselectRadios('${
            i.lyrs[0]
          }')" type="button">Clear radios</button><br>
          <input type="range" min="0" max="${
            i.colorCnt - 1
          }" value="0" class="slider" id="${i.lyrs[0]}_slider" name="${
            i.lyrs[0]
          }_slider"><br>`;
          // the slider changes the color/version of the item, equivalent to the color selector in picrew
          for (const j of i.items) {
            // add radio selector to choose item
            newselector += `<label><input type="radio" name="${
              i.lyrs[0]
            }" value="${
              j.itmId
            }"></input><img loading="lazy" width="50px" height="50px" src='https://cdn.picrew.me${
              j.thumbUrl ?? ""
            }'></label>`;
          }
          newselector += `</div>`;
        } else {
          // Non menu items are hidden
          newselector += `<div style="display:none;"><input type="range" min="0" max="${
            i.colorCnt - 1
          }" value="0" class="slider" id="${i.lyrs[0]}_slider" name="${
            i.lyrs[0]
          }_slider">`;
          for (const j of i.items) {
            newselector += `<input type="radio" name="${i.lyrs[0]}" value="${
              j.itmId
            }" checked></input><label><img loading="lazy" width="50px" height="50px" src='https://cdn.picrew.me${
              j.thumbUrl ?? ""
            }'></label>`;
          }
          newselector += `</div>`;
        }
      }
      // display all the stuff and set content
      document.getElementById("sidebar").style.display = "block";
      document.getElementById("selector").innerHTML = newselector;
      document.getElementById("main").innerHTML = newmain;
      document.getElementById("main").style.display = "block";
      info.style.display = "flex";
      document.getElementById("loading").style.display = "none";
      // and set the data for later use
      window.data = data;
    });
}
async function render() {
  // draws the image on the canvas based on the selected options
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  // wipe canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // get form data
  const form = new FormData(document.getElementById("selector"));
  // sort layers
  const sortedKeys = Object.entries(data.config.lyrList)
    .sort((a, b) => a[1] - b[1])
    .map(([key]) => key);
  // draw each layer in order
  for (const lyrKey of sortedKeys) {
    const selectedValue = form.get(String(lyrKey));
    if (selectedValue != null) {
      const img = new Image();
      // get image for selected url
      const sliderValue = document.getElementsByName(lyrKey + "_slider")[0]
        .value;
      const imageKey = Object.values(
        Object.values(window.data.commonImages[String(selectedValue)])[0]
      )[sliderValue];
      img.src = `https://cdn.picrew.me${imageKey.url}`;
      await new Promise((resolve) => {
        // wait for image to load before drawing, and make sure we draw in order
        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          resolve();
        };
      });
    }
  }
}
if (!makerId) {
  console.error("No ID found :( custom loading coming soon!");
}
loadById(makerId);
document.getElementById("selector").addEventListener("change", (event) => {
  // render when selected options change
  render();
});
document.addEventListener("click", function (event) {
  // dismiss info box on click
  document.getElementById("info").style.display = "none";
});
