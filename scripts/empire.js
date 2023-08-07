function isTargetDiv(node) {
    return (
        node.nodeName === 'DIV' &&
        node.getAttribute('data-v-41bcd563') !== null
    );
}

function appendTextToTargetDivs(rate) {
    const targetDivs = document.querySelectorAll('div[data-v-41bcd563][class]');
    for (const div of targetDivs) {
        if (isTargetDiv(div)) {
            if (!div.innerText.includes('(')) {
                let coins = parseFloat(div.innerText);
                div.innerText += ' (₹' + (coins * rate).toFixed(2).toString() + ')';
            }
        } else {
            console.log('Found a <div> element with attributes but not a direct text node:', div);
        }
    }
}

function checkAndAppendText(rate) {
    appendTextToTargetDivs(rate);
}

checkAndAppendText();

chrome.storage.local.get(['intervalValue'], function (result) {
    const intervalInSeconds = result.intervalValue || 5; // Default interval is 5 seconds
    chrome.storage.local.get(['rateValue'], function (result) {
        const rate = result.rateValue || 59.5; // Default interval is 59.5
        setInterval(checkAndAppendText, intervalInSeconds * 1000, rate);
    });
});