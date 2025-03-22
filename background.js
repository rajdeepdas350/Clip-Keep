console.log("Background script running!");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Clip Keep extension installed!");
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.includes("https://www.youtube.com/watch")) {
    console.log(
      "Navigation detected, injecting content.js into tab:",
      details.tabId
    );
    chrome.scripting.executeScript(
      {
        target: { tabId: details.tabId },
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Injection error on navigation:",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("Successfully injected content.js on navigation");
        }
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "injectContentScript") {
    console.log(
      "Background: Received request to inject content.js into tab:",
      message.tabId
    );
    chrome.scripting.executeScript(
      {
        target: { tabId: message.tabId },
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Background: Injection error:",
            chrome.runtime.lastError.message
          );
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          console.log("Background: Successfully injected content.js");
          sendResponse({ success: true });
        }
      }
    );
    return true;
  }
});
