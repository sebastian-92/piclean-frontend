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
      window.data = data; // make data global for access in other functions
      const info = document.getElementById("info");
      // this constructs the info box popup
      document.title = `Piclean - ${data.imageMakerInfo.title}`;
      info.innerHTML = `
        <h1 class='title'>${data.imageMakerInfo.title}</h1>
        <img class='desc_thumb' src='${
          data.imageMakerInfo.icon_url
        }' style="max-width:90%;max-height:300px;margin:10px 0;border-radius:10px;" />
        <a class='author_credit' href="creator.html?id=${
          data.imageMakerInfo.creator_id
        }">By ${data.imageMakerInfo.creator_name}</a>
        <p class='content'>${data.imageMakerInfo.description_html}</p>
        <h3 class='license_header'>License</h3>
        <table class='license_table'>
          <tr>
        <th>Type</th>
        <th>Allowed</th>
          </tr>
          <tr>
        <td>Personal Use</td>
        <td><input class="checkbox" onclick="return false" type="checkbox" ${
          data.imageMakerInfo.can_personal_use ? "checked" : ""
        }></td>
          </tr>
          <tr>
        <td>Non-Commercial Use</td>
        <td><input class="checkbox" onclick="return false" type="checkbox" ${
          data.imageMakerInfo.can_non_commercial_use ? "checked" : ""
        }></td>
          </tr>
          <tr>
        <td>Commercial Use</td>
        <td><input class="checkbox" onclick="return false" type="checkbox" ${
          data.imageMakerInfo.can_commercial_use ? "checked" : ""
        }></td>
          </tr>
          <tr>
        <td>Derivative Works</td>
        <td><input class="checkbox" onclick="return false" type="checkbox" ${
          data.imageMakerInfo.can_derivative_works ? "checked" : ""
        }></td>
          </tr>
        </table>
        `;
      // construct main canvas
      let newmain = `
        <canvas id="c" width="${data.config.w}" height="${data.config.h}" style="border:1px solid #000000;"></canvas>
        <br><button
        class="button is-success"
        id="loadButton"
        onclick="loadLocal(document.getElementById('slot').value)"
      >
        Load Slot</button
      ><button
        id="saveButton"
        class="button is-primary"
        onclick="saveLocal(document.getElementById('slot').value)"
      >
        Save Slot</button
      ><input
        class="input"
        type="number"
        id="slot"
        min="1"
        max="99"
        value="1"
        style="width: 4em;"
      /><button class="button is-info" id="import_button" type="button" onclick="document.getElementById('import-save').click()">Import Slot</button>
        <input class="file-input" type="file" name="import-save" id="import-save" accept=".json" style="display:none;" />
<button class="button is-link" id="export_button" onclick='exportData()'>Export Slot</button>`;
      let newselector = "";
      for (const i of data.config.pList) {
        if (i.isMenu) {
          // menu items are displayed in picrew
          newselector += `<div class="radio-section"><img loading="lazy" src='https://cdn.picrew.me${i.thumbUrl}' class="section-thumb"><br><p>${i.pNm}</p><button class="button is-info is-small" onclick="deselectRadios('${i.lyrs[0]}')" type="button">Clear radios</button><br>`;
          var k = 0;
          newselector += `<div class="mt-3" style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">`;
          for (const j of data.config.cpList[i.cpId]) {
            newselector += `<label style="display: inline-flex; align-items: center; margin-right: 4px;"><input class="radio" type="radio" name="${
              i.lyrs[0]
            }_slider" value="${k}" style="margin-right:2px;"${
              k == 0 ? " checked" : ""
            }/><svg width="24" height="24" style="vertical-align: middle;"><rect style="fill:${
              j.cd
            };" width="24" height="24" /></svg></label>`;
            k++;
          }
          newselector += `</div>`;
          newselector += `<br><label> Rotate (deg): <input class="input mb-2" type="number" value="0" id="${i.lyrs[0]}_r" name="${i.lyrs[0]}_r" value="0" style="width: 4em; margin-left: 10px;"></label><br><label> x: <input class="input" type="number" step="10" id="${i.lyrs[0]}_x" name="${i.lyrs[0]}_x" value="0" style="width: 4em; margin-left: 10px;"></label><label> y: <input class="input" type="number" step="10" id="${i.lyrs[0]}_y" name="${i.lyrs[0]}_y" value="0" style="width: 4em; margin-left: 10px;"></label><br>`;
          // the slider changes the color/version of the item, equivalent to the color selector in picrew
          // the x and y number inputs change the position of the item on the canvas
          for (const j of i.items) {
            // add radio selector to choose item
            newselector += `<label><input type="radio" real-id="${
              i.pId
            }-images" name="${i.lyrs[0]}" value="${
              j.itmId
            }"></input><img class="image is-50x50" src='https://cdn.picrew.me${
              j.thumbUrl ?? "https://placehold.co/50x50"
            }'></label>`;
          }
          newselector += `</div>`;
        } else {
          // Non menu items are hidden
          newselector += `<div style="display:none;"><input type="range" min="0" max="${
            i.colorCnt - 1
          }" value="0" class="slider" id="${i.lyrs[0]}_slider" name="${
            i.lyrs[0]
          }_slider"><input type="number" value="0" id="${
            i.lyrs[0]
          }_r" value="0" name="${
            i.lyrs[0]
          }_r" style="width: 4em; margin-left: 10px;"><input  type="number" id="${
            i.lyrs[0]
          }_x" value="0" name="${
            i.lyrs[0]
          }_x" style="width: 4em; margin-left: 10px;"><input class="input" type="number" id="${
            i.lyrs[0]
          }_y" value="0" name="${
            i.lyrs[0]
          }_y" style="width: 4em; margin-left: 10px;">`;
          for (const j of i.items) {
            newselector += `<input type="radio" name="${i.lyrs[0]}" value="${
              j.itmId
            }" real-id="${
              i.pId
            }-images" checked></input><label><img loading="lazy" width="50px" height="50px" src='https://cdn.picrew.me${
              j.thumbUrl ?? ""
            }'></label>`;
          }
          newselector += `</div>`;
        }
      }
      // display all the stuff and set content
      document.getElementById("sidebar").style.display = "block";
      document.getElementById("selector").innerHTML =
        newselector +
        "<button onclick='document.getElementById(\"selector\").reset();render()' class='button is-danger is-small' type='button'>Reset All</button><br>";
      document.getElementById("main").innerHTML = newmain;
      document.getElementById("main").style.display = "block";
      // import save function goes here because javascript was being stupid
      document.getElementById("import-save").onchange = function () {
        console.log("Importing save...");
        const file = document.getElementById("import-save").files[0];
        if (!file) {
          return;
        }
        document.getElementById("import-save").value = "";
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const importedData = JSON.parse(reader.result);
            loadData(importedData);
            render();
          } catch (error) {
            alert("Failed to import data: " + error.message);
          }
        };
        reader.readAsText(file);
      };
      // fill default values according to zeroConf
      for (const [key, val] of Object.entries(data.config.zeroConf)) {
        if (val.itmId == 0) continue;
        document
          .querySelectorAll('[real-id="' + key + '-images"]')
          .forEach((element) => {
            if (element.type === "radio") {
              if (element.value === String(val.itmId)) {
                element.checked = true;
                return;
              }
            }
          });
      }
      info.style.display = "flex";
      document.getElementById("loading").style.display = "none";
      render();
    });
}
// credit to https://stackoverflow.com/questions/32468969 for this function
// draws an image on a canvas at an angle
function draw(context, image, x, y, degrees) {
  context.translate(x + image.width / 2, y + image.height / 2);
  context.rotate((degrees * Math.PI) / 180);
  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    -image.width / 2,
    -image.height / 2,
    image.width,
    image.height
  );
  context.rotate((-degrees * Math.PI) / 180);
  context.translate(-x - image.width / 2, -y - image.height / 2);
}
// renders the images on the canvas based on the form data
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
      const sliderValue = form.get(lyrKey + "_slider");
      let imgUrls = [];
      Object.values(window.data.commonImages[String(selectedValue)]).forEach(
        (element) => {
          imgUrls.push(Object.values(element)[sliderValue].url);
        }
      );
      // get position and rotation values
      const xVal = form.get(String(lyrKey) + "_x");
      const yVal = form.get(String(lyrKey) + "_y");
      const rotation = form.get(String(lyrKey) + "_r");
      for (const imageKey of imgUrls) {
        img.src = cdn + imageKey;
        await new Promise((resolve) => {
          // wait for image to load before drawing, and make sure we draw in order
          img.onload = function () {
            // don't rotate if not needed, makes things faster
            if (rotation != 0) draw(ctx, img, xVal, yVal * -1, rotation);
            else ctx.drawImage(img, xVal, yVal * -1);
            resolve();
          };
        });
      }
    }
  }
}
function saveLocal(slot) {
  const formData = new FormData(document.getElementById("selector"));
  // save form data to local storage
  saveData(JSON.stringify(Object.fromEntries(formData)), slot);
}
function loadLocal(slot) {
  // parse data back into json
  const data = JSON.parse(localStorage.getItem("formData_" + makerId + slot));
  if (!data) return;
  loadData(data);
  // render the loaded form
  render();
}

function saveData(data, slot) {
  localStorage.setItem("formData_" + makerId + slot, data);
}
function loadData(data) {
  document.getElementById("selector").reset(); // reset form first
  // set form values from saved data
  for (const [key, val] of Object.entries(data)) {
    document.getElementsByName(key).forEach((element) => {
      if (element.type === "radio") {
        if (element.value === val) {
          element.checked = true;
        }
      } else {
        element.value = val;
      }
    });
  }
}
function exportData() {
  const slot = document.getElementById("slot").value;
  console.log("Exporting slot", slot);
  const data = localStorage.getItem("formData_" + makerId + slot);
  if (!data) {
    alert("No data in this slot!");
    return;
  }
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `piclean_save_${makerId}_slot${slot}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
if (!makerId) {
  console.error("No ID found :( custom loading coming soon!");
} else {
  loadById(makerId);
}
document.getElementById("selector").addEventListener("change", (event) => {
  // render when selected options change
  render();
});
document.addEventListener("click", function (event) {
  // dismiss info box on click
  document.getElementById("info").style.display = "none";
});
