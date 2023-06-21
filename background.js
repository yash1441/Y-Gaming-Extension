chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	const apiCall = request.url;
	fetch(apiCall, {
		method: "GET",
		"Content-Type": "application/json",
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			sendResponse(data);
		})
		.catch((error) => console.error(error));
	return true; // Will respond asynchronously.
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    if (details.url == "https://xplay.gg/store") {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ["scripts/content.js"],
        });
    }
});
