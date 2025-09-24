const app = document.getElementById("app");

let language = "en";
let currentFolderId = null;
let selectedFile = null;

function render() {
  app.innerHTML = `
    <div class="sidebar">
      <h3>Folders</h3>
      ${window.fileData.filter(f => f.type === "folder" && f.parentId === null)
        .map(f => `<div onclick="openFolder('${f.id}')">📂 ${f.name[language]}</div>`).join("")}
    </div>
    <div class="main">
      <input type="text" id="search" placeholder="Search..." oninput="searchFiles(this.value)" />
      <div class="grid">
        ${getCurrentFiles().map(file => `
          <div class="card" onclick="selectFile('${file.id}')">
            ${file.type === "image" ? `<img src="${file.cover}" />` : ""}
            ${file.type === "video" ? `<video src="${file.cover}" muted></video>` : ""}
            ${file.type === "audio" ? "🎵" : ""}
            ${file.type === "folder" ? "📂" : ""}
            <div>${file.name[language]}</div>
          </div>`).join("")}
      </div>
    </div>
    <div class="details">
      ${selectedFile ? renderDetails(selectedFile) : "Select a file to see details."}
    </div>
  `;
}

function getCurrentFiles() {
  return window.fileData.filter(f => f.parentId === currentFolderId || f.folderId === currentFolderId);
}

function openFolder(id) {
  currentFolderId = id;
  selectedFile = null;
  render();
}

function selectFile(id) {
  const file = window.fileData.find(f => f.id === id);
  if (file.type === "folder") {
    openFolder(file.id);
  } else {
    selectedFile = file;
    render();
  }
}

function renderDetails(file) {
  return `
    <h3>${file.name[language]}</h3>
    ${file.type === "image" ? `<img src="${file.cover}" />` : ""}
    ${file.type === "video" ? `<video src="${file.cover}" controls></video>` : ""}
    ${file.type === "audio" ? `<audio src="${file.cover}" controls></audio>` : ""}
    <p>Author: ${file.author || "-"}</p>
    <p>Source: <a href="${file.source}" target="_blank">Link</a></p>
    <button onclick="downloadFile('${file.cover}')">Download</button>
    ${file.subtitles ? `<h4>Subtitles</h4>
      ${file.subtitles.map(s => `<div>${s.lang} <button onclick="downloadFile('${s.url}')">Download</button></div>`).join("")}` : ""}
  `;
}

function downloadFile(url) {
  window.open(url, "_blank");
}

function searchFiles(q) {
  q = q.toLowerCase();
  const results = window.fileData.filter(f => f.name.en.toLowerCase().includes(q) || f.name.zh.includes(q));
  if (results.length) {
    app.querySelector(".grid").innerHTML = results.map(file => `
      <div class="card" onclick="selectFile('${file.id}')">
        ${file.type === "image" ? `<img src="${file.cover}" />` : ""}
        ${file.type === "video" ? `<video src="${file.cover}" muted></video>` : ""}
        ${file.type === "audio" ? "🎵" : ""}
        ${file.type === "folder" ? "📂" : ""}
        <div>${file.name[language]}</div>
      </div>`).join("");
  }
}

render();