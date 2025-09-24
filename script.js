// script.js

async function loadFiles() {
  try {
    const res = await fetch("YOUR_API_URL_HERE");
    const data = await res.json();

    // 确保有 files，否则传空数组
    render(data.files || []);
  } catch (err) {
    console.error("Error loading files:", err);
    render([]); // 避免卡死
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
      <div class="file-name">${file.name}</div>
      <div class="file-info">${file.mimeType}</div>
    `;

    container.appendChild(item);
  });
}

// 页面加载时执行
document.addEventListener("DOMContentLoaded", loadFiles);
