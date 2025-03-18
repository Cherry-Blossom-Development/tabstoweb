chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "sendTabs") {
    await handleSendTabs();
    sendResponse({ status: "Processing tabs..." });
  }
});

async function handleSendTabs() {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    let tabData = [];

    for (const t of tabs) {
      try {
        await chrome.tabs.update(t.id, { active: true });
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the tab to switch
        const image = await chrome.tabs.captureVisibleTab(t.windowId, { format: "png" });

        tabData.push({ url: t.url, title: t.title, image });
      } catch (error) {
        console.error(`Could not capture tab ${t.id}:`, error);
      }
    }

    // Store the tab data in `chrome.storage.local`
    await chrome.storage.local.set({ tabSnapshots: tabData });

    // Close all original tabs
    for (const t of tabs) {
      chrome.tabs.remove(t.id);
    }

    // Open the local web app (`tabs.html`)
    const localWebAppUrl = chrome.runtime.getURL("tabs.html");
    chrome.tabs.create({ url: localWebAppUrl });

  } catch (error) {
    console.error("Error processing tabs:", error);
  }
}