// 示例配置
window.fileData = [
  {
    id: "f001",
    type: "folder",
    name: { en: "Videos", zh: "视频素材" },
    parentId: null
  },
  {
    id: "vid001",
    folderId: "f001",
    type: "video",
    name: { en: "Campus Intro", zh: "校园介绍" },
    cover: "https://via.placeholder.com/300x200.png?text=Video+Preview",
    author: "Student A",
    source: "https://youtube.com/xxx",
    subtitles: [
      { lang: "English", url: "https://example.com/video1_en.vtt" },
      { lang: "中文", url: "https://example.com/video1_zh.vtt" }
    ]
  },
  {
    id: "f002",
    type: "folder",
    name: { en: "Images", zh: "图片素材" },
    parentId: null
  },
  {
    id: "img001",
    folderId: "f002",
    type: "image",
    name: { en: "School Gate", zh: "校门" },
    cover: "https://via.placeholder.com/300x200.png?text=Image+Preview",
    author: "Photographer B",
    source: "https://unsplash.com/xxx"
  }
];