console.log("Content script loaded on:", window.location.href);

// Retry finding the video element
function getVideoElement(callback, attempts = 5, delay = 500) {
  const video = document.querySelector("video");
  if (video) {
    callback(video);
  } else if (attempts > 0) {
    console.log(
      "Video element not found, retrying... Attempts left:",
      attempts
    );
    setTimeout(() => getVideoElement(callback, attempts - 1, delay), delay);
  } else {
    console.error("No video element found after retries!");
    callback(null);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  if (message.action === "getTimestamp") {
    getVideoElement((video) => {
      if (!video) {
        sendResponse({ title: "Unknown", time: 0 });
      } else {
        let title = document.title.replace(" - YouTube", "");
        title = title.replace(/^\(\d+\)\s*/, "");
        const time = video.currentTime;
        console.log("Sending timestamp:", { title, time });
        sendResponse({ title, time });
      }
    });
  } else if (message.action === "play") {
    getVideoElement((video) => {
      if (video) {
        video.currentTime = message.time;
        video.play();
        console.log("Playing video at:", message.time);
      } else {
        console.error("No video element to play!");
      }
    });
  }
  return true;
});
