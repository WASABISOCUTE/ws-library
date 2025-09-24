async function listFiles(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink)`;
  const res = await fetch(url);
  const data = await res.json();
  return data.files;
}

async function render() {
  const app = document.getElementById("app");
  const files = await listFiles(FOLDER_ID);

  app.innerHTML = `
    <div class="grid">
      ${files.map(f => `
        <div class="card">
          ${f.mimeType.includes("image") ? `<img src="${f.thumbnailLink}" />` : ""}
          ${f.mimeType.includes("video") ? `<video src="${f.webContentLink}" controls></video>` : ""}
          <div class="title">${f.name}</div>
          <a href="${f.webContentLink}" target="_blank">Download</a>
        </div>
      `).join("")}
    </div>
  `;
}

render();
