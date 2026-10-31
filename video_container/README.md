# 📂 ToonVerse Video Container Storage

This is your local cloud media server storage. Put your cartoon video files (.mp4, .mkv, .webm) in this folder.

## How to organize your video files:

### Method 1: By Cartoon Slug / Folder (Recommended)
Create a subfolder named after the cartoon slug or title:
```
video_container/
├── ben-10-alien-force/
│   ├── episode-01-1080p.mp4
│   └── episode-02-720p.mp4
├── tom-and-jerry/
│   └── classic-collection.mp4
├── spongebob-squarepants/
│   └── s01e01.mp4
└── avatar-the-last-airbender/
    └── episode-1.mp4
```

### Method 2: Direct Root Files
You can also drop files directly here with the cartoon title or slug in the filename:
- `ben-10-alien-force-s01e01-1080p.mp4`
- `tom-and-jerry-ep1.mp4`
- `chhota-bheem-dholakpur.mp4`

## Formats Supported:
- **.mp4 (H.264 / AAC)**: ⭐ **Best for in-browser streaming & all devices**
- **.webm (VP9 / Opus)**: Native browser streaming
- **.mkv**: Direct downloading (supported for streaming if player codec matches)

ToonVerse auto-scans this folder and serves HTTP 206 range requests for instant scrubbing/seeking and direct high-speed downloads!
