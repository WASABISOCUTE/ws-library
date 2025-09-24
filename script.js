async function loadFiles() {
  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,thumbnailLink,iconLink,webViewLink,owners)`
    );
    const data = await res.json();

    render(data.files || []);
  } catch (err) {
    console.error("Error loading files:", err);
    render([]);
  }
}

function render(files = []) {
  const container = document.getElementById("file-list");
  container.innerHTML = "";

  if (!files.length) {
    container.innerHTML = "<p style='color:gray'>没有文件可显示</p>";
    return;
  }

  files.forEach(file => {
    const item = document.createElement("div");
    item.className = "file-item";

    item.innerHTML = `
      <img src="${file.thumbnailLink || file.iconLink}" class="file-thumb"/>
      <div class="file-name">${file.name}</div>
      <button onclick="window.open('${file.webViewLink}', '_blank')">查看</button>
    `;

    container.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", loadFiles);
