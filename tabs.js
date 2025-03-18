// Retrieve tab data from `chrome.storage.local`
chrome.storage.local.get("tabSnapshots", (data) => {
    if (data.tabSnapshots) {
        const tabData = data.tabSnapshots;
        const container = document.getElementById("tabs-container");

        // Render each tab snapshot in a grid
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

        // Clear the stored tab snapshots to avoid displaying old data on refresh
        chrome.storage.local.remove("tabSnapshots");
    }
});