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
const corsProxy = localStorage.getItem("corsProxy") ?? "https://cors-anywhere.cbass92.org";
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
  localforage.getItem("picrew-backup-" + id).then(async (backupData) => {
    if (backupData) {
      console.log("Found backup data for picrew", id, ", loading...");
      window.zipLoaderInstance = await ZipLoader.unzip(backupData);
      window.data = window.zipLoaderInstance.extractAsJSON('data.json');
      if (window.data.isLonely) {
        window.isBackup = false;
      } else {
        window.isBackup = true;
      }
      setupPicrew();
    }
    else {
      fetch(backend + "/idata/" + String(id))
        .then((res) => res.json())
        .then((data) => {
          window.data = data;
          window.isBackup = false;
          setupPicrew();
        });
    }
  });
}
function setupPicrew() {
  try {
    const info = document.getElementById("info");
    // this constructs the info box popup
    document.title = `Piclean - ${window.data.imageMakerInfo.title}`;
    info.innerHTML = `
        <h1 class='title'>${window.data.imageMakerInfo.title}</h1>
        <img class='desc_thumb' src='${window.isBackup && window.data.imageMakerInfo.icon_url ? window.zipLoaderInstance.extractAsBlobUrl(window.data.imageMakerInfo.icon_url.replace("https://", ""), 'image/png') : window.data.imageMakerInfo.icon_url.replace("https://cdn.picrew.me", cdn)
      }' style="max-width:90%;margin:10px 0;border-radius:10px;" />
        <a class='author_credit' href="creator.html?id=${window.data.imageMakerInfo.creator_id
      }">By ${window.data.imageMakerInfo.creator_name}</a>
        <p class='content'>${window.data.imageMakerInfo.description_html}</p>
        <h3 class='license_header'>License</h3>
        <table class='license_table'>
          <tr>
        <th>Type</th>
        <th>Allowed</th>
          </tr>
          <tr>
        <td>Personal Use</td>
        <td><input class="checkbox" onclick="return false" type="checkbox" ${data.imageMakerInfo.can_personal_use ? "checked" : ""
      }></td>
          </tr>
          <tr>
        <td>Non-Commercial Use</td>
        <td><input class="checkbox" onclick="return false" type="checkbox" ${data.imageMakerInfo.can_non_commercial_use ? "checked" : ""
      }></td>
          </tr>
          <tr>
        <td>Commercial Use</td>
        <td><input class="checkbox" onclick="return false" type="checkbox" ${data.imageMakerInfo.can_commercial_use ? "checked" : ""
      }></td>
          </tr>
          <tr>
        <td>Derivative Works</td>
        <td><input class="checkbox" onclick="return false" type="checkbox" ${data.imageMakerInfo.can_derivative_works ? "checked" : ""
      }></td>
          </tr>
        </table>
        `;
    // construct main canvas
    let newmain = `
        <canvas id="c" width="${window.data.config.w}" height="${window.data.config.h}" style="border:1px solid #000000;"></canvas>
        <br><button
        class="button is-success"
        id="loadButton"
        onclick="loadLocal(document.getElementById('slot').value)"
      >
        Load Slot</button
      ><button
        id="saveButton"
        class="button is-primary ml-2"
        onclick="saveLocal(document.getElementById('slot').value)"
      >
        Save Slot</button
      ><input
        class="input ml-2"
        type="number"
        id="slot"
        min="1"
        max="99"
        value="1"
        style="width: 4em;"
      /><button class="button is-info ml-2" id="import_button" type="button" onclick="document.getElementById('import-save').click()">Import Slot</button>
        <input class="ml-2 file-input" type="file" name="import-save" id="import-save" accept=".json" style="display:none;" />
<button class="button is-link ml-2" id="export_button" onclick='exportData()'>Export Slot</button><br><button class="button is-warning mr-2" id="backup_button" onclick='backupPicrew(window.data)'>Backup Picrew</button><button class="button is-light" id="download_json_button" onclick='downloadJSON()'>Download Data JSON</button>
        `;
    // construct sidebar selectors
    let newselector = "";
    for (const i of window.data.config.pList) {
      // menu items are displayed in picrew
      console.log(i.thumbUrl);
      newselector += `<div class="radio-section"><img loading="lazy" src='${window.isBackup && i.thumbUrl ? window.zipLoaderInstance.extractAsBlobUrl("cdn.picrew.me" + i.thumbUrl, 'image/png') : cdn + i.thumbUrl}' class="section-thumb"><br><p>${i.pNm}</p><button class="button is-info is-small" onclick="deselectRadios('${i.lyrs[0]}')" type="button">Clear radios</button><br>`;
      var k = 0;
      newselector += `<div class="mt-3" style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">`;
      for (const j of window.data.config.cpList[i.cpId]) {
        newselector += `<label style="display: inline-flex; align-items: center; margin-right: 4px;"><input class="radio" type="radio" name="${i.lyrs[0]
          }_slider" value="${k}" style="margin-right:2px;"${k == 0 ? " checked" : ""
          }/><svg width="24" height="24" style="vertical-align: middle;"><rect style="fill:${j.cd
          };" width="24" height="24" /></svg></label>`;
        k++;
      }
      newselector += `</div>`;
      newselector += `<br><label> Rotate (deg): <input class="input mb-2" type="number" value="0" id="${i.lyrs[0]}_r" name="${i.lyrs[0]}_r" value="0" style="width: 4em; margin-left: 10px;"></label><br><label> x: <input class="input" type="number" step="10" id="${i.lyrs[0]}_x" name="${i.lyrs[0]}_x" value="0" style="width: 4em; margin-left: 10px;"></label><label> y: <input class="input" type="number" step="10" id="${i.lyrs[0]}_y" name="${i.lyrs[0]}_y" value="0" style="width: 4em; margin-left: 10px;"></label><br>`;
      // the slider changes the color/version of the item, equivalent to the color selector in picrew
      // the x and y number inputs change the position of the item on the canvas
      for (const j of i.items) {
        console.log(isBackup)
        // add radio selector to choose item
        newselector += `<div style="display: inline-block; width: 54px; margin: 2px; text-align: center;">
              <label>
              <input type="radio" real-id="${i.pId}-images" name="${i.lyrs[0]
          }" value="${j.itmId}">
              <img class="image is-50x50" style="display: block; margin: 0 auto; background-color: gray; border-radius: 8px;" src='${window.isBackup && j.thumbUrl ? window.zipLoaderInstance.extractAsBlobUrl("cdn.picrew.me" + j.thumbUrl, 'image/png') : (cdn + j.thumbUrl ?? "//placehold.co/50x50")
          }'>
              </label>
            </div>`;
      }
      newselector += `</div>`;
    }
    // display all the stuff and set content
    // Sidebar visibility is controlled by CSS and the `.open` class for mobile animations
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
  } catch (e) {
    console.error("Error setting up picrew:", e);
    alert("An error occurred while setting up the Picrew. " + e.message);
  }
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
        img.src = window.isBackup ? window.zipLoaderInstance.extractAsBlobUrl("cdn.picrew.me" + imageKey, 'image/png') : cdn + imageKey;
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
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  sb.classList.toggle('open');
}

function toggleInfo(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const info = document.getElementById('info');
  if (!info) return;
  info.style.display = info.style.display === 'flex' ? 'none' : 'flex';
}

// mobile menu button hookup (if present)
document.getElementById('mobileMenuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleSidebar();
});

document.addEventListener("click", function (event) {
  // don't auto-close when clicking inside the info panel or the sidebar or using the mobile button
  const info = document.getElementById("info");
  const sidebar = document.getElementById("sidebar");
  if ((info && info.contains(event.target)) || (sidebar && sidebar.contains(event.target)) || event.target.id === 'mobileMenuBtn' || (event.target.closest && event.target.closest('#mobileMenuBtn'))) {
    return;
  }
  if (info) info.style.display = "none";
  // on small screens, clicking outside should also hide the sidebar
  if (window.innerWidth <= 900 && sidebar && !sidebar.contains(event.target)) sidebar.classList.remove('open');
});
// walks through a json object and calls callback on every string found
function walk(obj, callback) {
  if (obj === null || obj === undefined) return;

  if (typeof obj === "string") {
    callback(obj);
    return;
  }

  if (Array.isArray(obj)) {
    for (const item of obj) walk(item, callback);
    return;
  }

  if (typeof obj === "object") {
    for (const key in obj) walk(obj[key], callback);
    return;
  }
}
function saveAs(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
async function backupPicrew(jsonData) {
  console.log("Backing up picrew...");
  const backupButton = document.getElementById("backup_button");
  backupButton.disabled = true;
  backupButton.innerText = "Backing up...";

  const backupZip = new JSZip();
  const urlSet = new Set(); // store unique urls

  // collect unique URLs/paths
  walk(jsonData, (str) => {
    try {
      if (str.startsWith("/")) {
        const url = corsProxy + "/" +cdn.replace("https://", "") + str;
        urlSet.add(url);
      } else if (str.startsWith("https://cdn.picrew.me")) {
        urlSet.add(str.replace("https://cdn.picrew.me", corsProxy +"/"+ cdn.replace("https://", "")));
      }
    } catch (e) {
      console.error("Error while collecting urls:", e);
    }
  });

  const entries = Array.from(urlSet).map((url) => ({ url }));
  const batchSize = 500;
  // I need to batch to avoid overwhelming the loser chrome users
  // stupid chrome doesn't like too many concurrent fetches
  // 500 should be fine, because i'm pretty sure the largest image size is 400x400
  // unnecessary on firefox but whatever

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    console.log(`Fetching batch ${Math.floor(i / batchSize) + 1} (${batch.length} files)...`);
    const fetchPromises = batch.map(async ({ url }) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        const blob = await res.blob();
        return { url, blob };
      } catch (err) {
        console.error("There has been a problem with your fetch operation:", err);
        return { url, error: err };
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    // add successful fetches to the zip
    for (const r of results) {
      if (r.status === "fulfilled") {
        const value = r.value;
        if (value && !value.error) {
          try {
            // derive a safe filename from the URL path and strip leading slashes
            const urlObj = new URL(value.url);
            let filename = urlObj.pathname.replace(/^\/+/, "");
            // avoid collisions by appending a counter if needed
            let counter = 1;
            const base = filename;
            while (backupZip.file(filename)) {
              const dot = base.lastIndexOf(".");
              filename = dot === -1
                ? `${base}_${counter++}`
                : `${base.slice(0, dot)}_${counter++}${base.slice(dot)}`;
            }
            backupZip.file(filename, value.blob);
          } catch (e) {
            console.error("Failed to add file to zip:", e);
          }
        }
      } else {
        console.error("Fetch promise rejected:", r.reason);
      }
    }
    // update button text to show progress
    backupButton.innerText = `Backing up... (${Math.min(i + batchSize, entries.length)}/${entries.length})`;
    // give the browser a moment to breathe
    await new Promise((res) => setTimeout(res, 50));
  }

  try {
    backupZip.file("data.json", JSON.stringify(jsonData));
    const content = await backupZip.generateAsync({ type: "blob" });
    console.log("Zip generated, starting download...");
    saveAs(content, `piclean_backup_${makerId}.zip`);
  } catch (e) {
    console.error("Failed to generate/save zip:", e);
    alert("Failed to generate backup: " + e.message);
  } finally {
    backupButton.disabled = false;
    backupButton.innerText = "Backup Picrew";
  }
}
function downloadJSON() {
  const dataStr = JSON.stringify(window.data);
  const blob = new Blob([dataStr], { type: "application/json" });
  saveAs(blob, `piclean_data_${makerId}.json`);
}