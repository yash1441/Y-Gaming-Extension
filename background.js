chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'saveInterval') {
		const intervalValue = parseInt(request.intervalValue, 10);
		if (!isNaN(intervalValue) && intervalValue > 0) {
			chrome.storage.local.set({ 'intervalValue': intervalValue }, function () {
				return console.log('Interval value saved:', intervalValue);
			});
		} else return console.log('Interval value failed to saved:', intervalValue);
	} else if (request.action === 'saveRate' && !request.url) {
		const rateValue = parseFloat(request.rateValue);
		if (!isNaN(rateValue) && rateValue > 0) {
			chrome.storage.local.set({ 'rateValue': rateValue }, function () {
				return console.log('Rate value saved:', rateValue);
			});
		} else return console.log('Rate value failed to saved:', rateValue);
	} else if (request.url) {
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
		return true;
	}
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