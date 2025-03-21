function generateUniqueId() {
    return 'snapshot-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

function saveSnapshot(id, tabData) {
    chrome.storage.local.set({ [id]: tabData }, () => {
        updateSnapshotList();
        window.history.replaceState(null, "", `?id=${id}`);
    });
}

function loadSnapshot(id) {
    return new Promise((resolve) => {
        chrome.storage.local.get(id, (result) => {
            resolve(result[id] || null);
        });
    });
}

function deleteSnapshot(id) {
    chrome.storage.local.remove(id, () => {
        updateSnapshotList();
        window.location.search = "";
    });
}

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

document.getElementById("snapshotList").addEventListener("change", async function() {
    const snapshotId = this.value;
    if (snapshotId) {
        const savedTabs = await loadSnapshot(snapshotId);
        if (savedTabs) {
            displayTabs(savedTabs);
            window.history.replaceState(null, "", `?id=${snapshotId}`);
        }
    }
});

document.getElementById("clearSnapshots").addEventListener("click", function() {
    if (confirm("Are you sure you want to delete all snapshots?")) {
        chrome.storage.local.get(null, (items) => {
            Object.keys(items).forEach(key => {
                if (key.startsWith("snapshot-")) {
                    chrome.storage.local.remove(key);
                }
            });
            updateSnapshotList();
            window.location.search = "";
            document.getElementById("tabs-container").innerHTML = "";
        });
    }
});

const urlParams = new URLSearchParams(window.location.search);
const snapshotId = urlParams.get("id");

if (snapshotId) {
    loadSnapshot(snapshotId).then(savedTabs => {
        if (savedTabs) {
            displayTabs(savedTabs);
        } else {
            console.error("Snapshot not found.");
        }
    });
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

updateSnapshotList();
