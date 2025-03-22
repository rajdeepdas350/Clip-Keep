# Clip Keep - Chrome Extension

![Clip Keep Icon](assets\clip48.png)

**Clip Keep** is a Chrome extension that allows you to save timestamps of YouTube videos with custom tags, making it easy to revisit specific moments in videos. You can save, play, and delete timestamps directly from the extension's popup.

---

## ✨ Features

✔ **Save Timestamps** – Save the current timestamp of a YouTube video with a custom tag (e.g., "Intro", "Tutorial").  
✔ **Play Timestamps** – Jump to a saved timestamp and play the video from that point.  
✔ **Delete Timestamps** – Remove saved timestamps you no longer need.  
✔ **Persistent Storage** – Timestamps are saved locally using Chrome's storage API, so they persist across browser sessions.  
✔ **User-Friendly Interface** – Styled with Poppins font and Material Symbols for a modern look.  
✔ **Floating Save Button** – A quick-access button appears on YouTube to save timestamps easily.

---

## 📸 Screenshots

### **Popup UI**

![Popup Screenshot](assets\keep-clip1.png)

### **Saved YT video lists**

![Floating Button Screenshot](assets\keep-clip2.png)

---

## 🚀 Installation

### Option 1: Install via GitHub (Developer Mode)

Follow these steps to install the extension directly from this GitHub repository:

1. **Clone or Download the Repository**:
   - Click the green `"Code"` button at the top of this repository.
   - Select `"Download ZIP"` to download the project as a ZIP file, or clone it using Git:
     ```bash
     git clone https://github.com/rajdeepdas350/Clip-Keep
     ```
2. **Extract the ZIP File** (if downloaded) and save it in a folder.

3. **Load the Extension in Chrome**:

   - Open **Google Chrome** and go to `chrome://extensions/`.
   - Enable **Developer Mode** (top right corner).
   - Click **Load Unpacked** and select the extracted folder.

4. **Done!** 🎉 The extension should now be installed and ready to use.

---

## 🛠️ How to Use

1. **Open a YouTube Video** 🎬
2. **Click the Floating "Save Timestamp" Button** ⏳
3. **Enter a Tag & Save the Timestamp** 🏷️
4. **Open the Extension Popup** 🔍
5. **Click "Play" to Jump to the Saved Timestamp** ▶
6. **Delete Entries When Not Needed** ❌

---

## 🔧 How It Works

1. **Content Script (`content.js`)**

   - Injects the floating **Save Timestamp** button into YouTube videos.
   - Listens for user clicks to fetch the current timestamp.
   - Sends the timestamp to the background script.

2. **Background Script (`background.js`)**

   - Manages data storage using Chrome's storage API.
   - Handles messaging between popup and content script.

3. **Popup Script (`popup.js`)**
   - Displays saved timestamps in a popup UI.
   - Allows users to play or delete timestamps.

---

## 🎨 UI & Design

- Icons from **Material Symbols**.
- Simple and clean interface.

## 🌟 Show Your Support

If you like this project, please ⭐ star this repository and share it! 🚀
