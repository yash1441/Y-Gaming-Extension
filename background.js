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
			files: ["scripts/xplay.js"],
		});
	} else if (details.url == "https://csgoempire.com/withdraw/steam/market") {
		chrome.scripting.executeScript({
			target: { tabId: details.tabId },
			files: ["scripts/empire.js"],
		});
	}
}/*, {
	url: [{ urlEquals: "https://xplay.gg/store" }]
}*/);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === 'saveInterval') {
		const intervalValue = parseInt(message.intervalValue, 10);
		if (!isNaN(intervalValue) && intervalValue > 0) {
			chrome.storage.local.set({ 'intervalValue': intervalValue }, function () {
				console.log('Interval value saved:', intervalValue);
			});
		}
	} else if (message.action === 'saveRate') {
		const rateValue = parseFloat(message.rateValue);
		if (!isNaN(rateValue) && rateValue > 0) {
			chrome.storage.local.set({ 'rateValue': rateValue }, function () {
				console.log('Rate value saved:', rateValue);
			});
		}
	}
});  