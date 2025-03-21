// Update snapshot list in popup
function updateSnapshotList() {
  const snapshotList = document.getElementById("snapshotList");
  snapshotList.innerHTML = '<option value="">Select a Snapshot</option>';
  
  chrome.storage.local.get(null, (items) => {
    Object.keys(items).forEach(key => {
      if (key.startsWith("snapshot-")) {
        let option = document.createElement("option");
        option.value = key;
        option.textContent = new Date(parseInt(key.split('-')[1])).toLocaleString();
        snapshotList.appendChild(option);
      }
    });
  });
}

// Load snapshot when selected from dropdown
document.getElementById('snapshotList').addEventListener('change', (event) => {
  const snapshotId = event.target.value;
  if (snapshotId) {
    chrome.tabs.create({ 
      url: `chrome-extension://${chrome.runtime.id}/tabs.html?id=${snapshotId}`,
      active: true
    });
    window.close(); // Close the popup after loading snapshot
  }
});

// Create new snapshot from current tabs
document.getElementById('sendTabs').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'sendTabs' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error:", chrome.runtime.lastError);
    } else {
      console.log("Response from background:", response);
      window.close(); // Close the popup after creating snapshot
    }
  });
});

// Update snapshot list when popup opens
document.addEventListener('DOMContentLoaded', updateSnapshotList);
