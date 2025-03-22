document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup loaded");
  loadBookmarks();
  document.getElementById("saveBtn").addEventListener("click", saveBookmark);
});

function saveBookmark() {
  const tag = document.getElementById("tagInput").value || "Untitled";
  console.log("Saving bookmark with tag:", tag);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Active tab:", tabs[0]);
    if (!tabs[0] || !tabs[0].url.includes("https://www.youtube.com/watch")) {
      alert("Please use this extension on a YouTube video page!");
      console.log("Invalid tab or URL:", tabs[0]?.url);
      return;
    }

    const trySendMessage = (attemptsLeft) => {
      console.log(
        "Sending message to tab:",
        tabs[0].id,
        "Attempts left:",
        attemptsLeft
      );

      chrome.tabs.get(tabs[0].id, (tab) => {
        if (chrome.runtime.lastError) {
          console.error("Error getting tab:", chrome.runtime.lastError.message);
          alert("Failed to access the tab.");
          return;
        }

        if (tab.status !== "complete") {
          console.log("Tab not fully loaded, status:", tab.status);
          if (attemptsLeft > 0) {
            setTimeout(() => trySendMessage(attemptsLeft - 1), 1500);
            return;
          }
          alert("Tab is still loading. Please wait and try again.");
          return;
        }

        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getTimestamp" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Message error:", chrome.runtime.lastError.message);
              if (attemptsLeft > 0) {
                console.log(
                  "Retrying due to error:",
                  chrome.runtime.lastError.message
                );
                if (attemptsLeft === 5) {
                  chrome.runtime.sendMessage(
                    { action: "injectContentScript", tabId: tabs[0].id },
                    (injectionResponse) => {
                      if (chrome.runtime.lastError) {
                        console.error(
                          "Failed to communicate with background:",
                          chrome.runtime.lastError.message
                        );
                        alert("Failed to inject content script.");
                        return;
                      }
                      if (injectionResponse && injectionResponse.success) {
                        console.log(
                          "Popup: Content script injection successful"
                        );
                        setTimeout(
                          () => trySendMessage(attemptsLeft - 1),
                          1000
                        );
                      } else {
                        console.error(
                          "Popup: Injection failed:",
                          injectionResponse?.error
                        );
                        alert("Failed to inject content script.");
                      }
                    }
                  );
                } else {
                  setTimeout(() => trySendMessage(attemptsLeft - 1), 1000);
                }
                return;
              }
              console.error("Final error:", chrome.runtime.lastError.message);
              alert("Failed to get timestamp after retries.");
              return;
            }

            if (!response || typeof response.time === "undefined") {
              console.error("Invalid response:", response);
              alert("Could not retrieve timestamp.");
              return;
            }

            console.log("Received response:", response);
            const bookmark = {
              title: response.title,
              timestamp: response.time,
              tag: tag,
            };

            chrome.storage.local.get("bookmarks", (data) => {
              const bookmarks = data.bookmarks || [];
              bookmarks.push(bookmark);
              console.log("Saving bookmarks:", bookmarks);
              chrome.storage.local.set({ bookmarks }, () => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Storage save error:",
                    chrome.runtime.lastError
                  );
                } else {
                  console.log("Bookmarks saved successfully");
                  loadBookmarks();
                  document.getElementById("tagInput").value = "";
                }
              });
            });
          }
        );
      });
    };

    trySendMessage(5);
  });
}

function loadBookmarks() {
  chrome.storage.local.get("bookmarks", (data) => {
    const bookmarks = data.bookmarks || [];
    console.log("Loaded bookmarks:", bookmarks);
    const list = document.getElementById("bookmarks");
    if (!list) {
      console.error("Bookmarks element not found!");
      return;
    }

    list.innerHTML = "";
    bookmarks.forEach((bookmark, index) => {
      console.log("Rendering bookmark:", bookmark);
      const li = document.createElement("li");
      li.classList.add("bookmark");
      li.innerHTML = `
        <span><span id="tag-bold">${bookmark.tag}:</span> ${
        bookmark.title
      } - ${formatTime(bookmark.timestamp)}</span>
        <button class="play-btn"><img src="assets/play_btn.png" alt="play button"></button>
        <button class="delete-btn"><img src="assets/delete_btn.png" alt="delete button"></button>
      `;
      li.querySelector(".play-btn").addEventListener("click", () =>
        playTimestamp(bookmark.timestamp)
      );
      li.querySelector(".delete-btn").addEventListener("click", () =>
        deleteBookmark(index)
      );
      list.appendChild(li);
    });
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function playTimestamp(time) {
  console.log("Playing timestamp:", time);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "play", time });
    }
  });
}

function deleteBookmark(index) {
  console.log("Deleting bookmark at index:", index);
  chrome.storage.local.get("bookmarks", (data) => {
    const bookmarks = data.bookmarks || [];
    bookmarks.splice(index, 1);
    chrome.storage.local.set({ bookmarks }, () => {
      if (chrome.runtime.lastError) {
        console.error("Storage delete error:", chrome.runtime.lastError);
      } else {
        loadBookmarks();
      }
    });
  });
}
