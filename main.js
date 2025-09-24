import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Fuse from "fuse.js";

// 你的 Google Drive 文件夹 ID 和 API KEY
const FOLDER_ID = "1XV_0gUgPc1f8-WWFHFSEI6bhlc_xxSyO";
const API_KEY = "AIzaSyBOM1ZZHjbGM8F4kbEpJsfw5MSblJybuMo";

// 获取文件夹下的文件
async function fetchDriveFiles(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,thumbnailLink,webViewLink,iconLink)`;
  const res = await fetch(url);
  const data = await res.json();
  return data.files || [];
}

export default function DriveStyleLibrary() {
  const [filesData, setFilesData] = useState([]);
  const [language, setLanguage] = useState("en");
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(FOLDER_ID);

  useEffect(() => {
    async function loadFiles() {
      const files = await fetchDriveFiles(currentFolderId);
      setFilesData(files);
      setSelectedFile(null);
    }
    loadFiles();
  }, [currentFolderId]);

  // 搜索
  const fuse = new Fuse(filesData, {
    keys: ["name"],
    threshold: 0.3,
  });
  const searchResults = query ? fuse.search(query).map((r) => r.item) : null;
  const currentFiles = searchResults || filesData;

  // 判断文件类型
  function getFileType(file) {
    if (file.mimeType === "application/vnd.google-apps.folder") return "folder";
    if (file.mimeType.startsWith("image/")) return "image";
    if (file.mimeType.startsWith("video/")) return "video";
    if (file.mimeType.startsWith("audio/")) return "audio";
    return "file";
  }

  return (
    <div className="flex h-screen">
      {/* 左侧文件夹树 */}
      <div className="w-1/5 border-r p-2 overflow-y-auto">
        <div className="mb-4 flex items-center gap-2">
          <span className="font-bold">Language:</span>
          <Button size="sm" variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")}>English</Button>
          <Button size="sm" variant={language === "zh" ? "default" : "outline"} onClick={() => setLanguage("zh")}>中文</Button>
        </div>
        <h2 className="font-bold mb-2">{language === "en" ? "Folders" : "文件夹"}</h2>
        {/* 只显示当前文件夹，Google Drive API 只能逐层获取 */}
        <div className="cursor-pointer mb-1 font-bold">📂 Google Drive</div>
      </div>

      {/* 中间文件区 */}
      <div className="w-3/5 p-4 overflow-y-auto">
        <input
          type="text"
          placeholder={language === "en" ? "Search..." : "搜索..."}
          className="border rounded p-2 w-full mb-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-4">
          {currentFiles.map((file) => (
            <Card
              key={file.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => {
                if (getFileType(file) === "folder") {
                  setCurrentFolderId(file.id);
                  setQuery("");
                } else {
                  setSelectedFile(file);
                }
              }}
            >
              <CardContent className="p-2">
                {getFileType(file) === "image" && (
                  <img src={file.thumbnailLink || file.iconLink} alt={file.name} className="w-full h-24 object-cover rounded" />
                )}
                {getFileType(file) === "video" && (
                  <div className="h-24 flex items-center justify-center bg-gray-100 text-2xl">🎬</div>
                )}
                {getFileType(file) === "audio" && (
                  <div className="h-24 flex items-center justify-center bg-gray-100 text-2xl">🎵</div>
                )}
                {getFileType(file) === "folder" && (
                  <div className="h-24 flex items-center justify-center bg-gray-100 text-2xl">📂</div>
                )}
                <div className="text-sm mt-1 truncate">{file.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 右侧详情面板 */}
      <div className="w-1/5 border-l p-4">
        {selectedFile ? (
          <div>
            <h2 className="font-bold mb-2">{selectedFile.name}</h2>
            {/* 文件预览 */}
            {getFileType(selectedFile) === "image" && <img src={selectedFile.thumbnailLink || selectedFile.iconLink} alt={selectedFile.name} className="rounded" />}
            {/* 预览链接（Google Drive 只允许 webViewLink 预览和下载） */}
            <div className="mt-2 text-sm">
              <p>
                {language === "en" ? "Preview" : "预览"}:{" "}
                <a href={selectedFile.webViewLink} target="_blank" rel="noreferrer" className="text-blue-500">
                  {language === "en" ? "Open in Google Drive" : "在 Google 云端硬盘打开"}
                </a>
              </p>
            </div>
            {/* 下载按钮（webViewLink 通常支持下载/预览） */}
            <Button className="mt-2" onClick={() => window.open(selectedFile.webViewLink, "_blank")}>
              {language === "en" ? "Download" : "下载"}
            </Button>
          </div>
        ) : (
          <div className="text-gray-500">
            {language === "en" ? "Select a file to see details." : "请选择一个文件以查看详情。"}
          </div>
        )}
      </div>
    </div>
  );
}
