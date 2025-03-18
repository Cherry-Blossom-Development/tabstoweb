function generateUniqueId() {
    return 'snapshot-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

function saveSnapshot(id, tabData) {
    localStorage.setItem(id, JSON.stringify(tabData));
    window.history.replaceState(null, "", `?id=${id}`);
}

function loadSnapshot(id) {
    const data = localStorage.getItem(id);
    return data ? JSON.parse(data) : null;
}

function displayTabs(tabData) {
    const container = document.getElementById("tabs-container");
    container.innerHTML = "";
    tabData.forEach(tab => {
        const tile = document.createElement("div");
        tile.classList.add("bg-white", "shadow-md", "rounded-lg", "p-2", "overflow-hidden");
        tile.innerHTML = `
            <a href="${tab.url}" target="_blank" class="block">
                <img src="${tab.image}" class="w-full h-auto aspect-[16/9] object-cover rounded-md">
                <p class="text-center text-sm mt-2 font-medium">${tab.title}</p>
            </a>
        `;
        container.appendChild(tile);
    });
}

const urlParams = new URLSearchParams(window.location.search);
const snapshotId = urlParams.get("id");

if (snapshotId) {
    const savedTabs = loadSnapshot(snapshotId);
    if (savedTabs) {
        displayTabs(savedTabs);
    } else {
        console.error("Snapshot not found.");
    }
} else {
    chrome.storage.local.get("tabSnapshots", (data) => {
        if (data.tabSnapshots) {
            const newSnapshotId = generateUniqueId();
            saveSnapshot(newSnapshotId, data.tabSnapshots);
            displayTabs(data.tabSnapshots);
            chrome.storage.local.remove("tabSnapshots");
        }
    });
}