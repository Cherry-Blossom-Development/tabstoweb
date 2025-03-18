document.getElementById('sendTabs').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'sendTabs' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error:", chrome.runtime.lastError);
    } else {
      console.log("Response from background:", response);
    }
  });
});
