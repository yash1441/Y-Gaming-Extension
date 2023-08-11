function checkAndAppendText(rate) {
    readMatchingDivs(rate);
}

checkAndAppendText();

chrome.storage.local.get(['intervalValue', 'rateValue'], function (result) {
    const intervalInSeconds = result.intervalValue || 5;
    const rate = result.rateValue || 59.5;

    setInterval(checkAndAppendText, intervalInSeconds * 1000, rate);
});

function containsRequiredClassname(classname) {
    return classname.includes("site") && classname.includes("layout") && classname.includes("main");
}

async function readMatchingDivs(rate) {
    const divElements = document.querySelectorAll('div');
    let item = [];
    let itemElements = [];

    for (const divElement of divElements) {
        if (containsRequiredClassname(divElement.className)) {
            itemElements = divElement.querySelectorAll('.item');
        }
    }

    for (const itemElement of itemElements) {
        let firstChild = itemElement.firstElementChild;
        if (firstChild.className.startsWith("item__special")) firstChild = itemElement.children[1];

        await checkStickers(itemElement);

        if (firstChild) {
            const coinChild = firstChild.children[1].children[0].children[0].children[0].children[1];
            if (coinChild) {
                const coins = parseFloat(coinChild.textContent.replace(/,/g, '')).toFixed(2);
                const coinRate = '(₹' + (coins * rate).toFixed(2).toString() + ')';
                const coinRateCheck = coinChild.nextElementSibling;

                if (coinRateCheck && coinRateCheck.classList.contains('coinRate')) {
                    if (coinRateCheck.innerText != coinRate) {
                        console.log('Updated from: ' + coinRateCheck.innerText + ' to ' + coinRate);
                        coinRateCheck.innerText = coinRate;
                    }
                } else {
                    const coinRateDiv = document.createElement('div');
                    coinRateDiv.className = 'coinRate';
                    coinRateDiv.innerText = coinRate;
                    coinChild.insertAdjacentElement('afterend', coinRateDiv);
                }
            }
        }
    }
}

async function checkStickers(item) {
    let element = item.firstElementChild;
    if (element.className.startsWith("item__special")) element = item.children[1];
    const stickersDiv = element.querySelector('.stickers');
    let imgElements = [];

    if (stickersDiv) imgElements = stickersDiv.querySelectorAll('img');
    else return;

    // Check if all the elements of imgElements include undefined
    let allUndefined = true;
    for (const imgElement of imgElements) {
        if (!imgElement.alt.includes('undefined')) allUndefined = false;
    }

    if (allUndefined) return;


    const buttons = element.querySelectorAll('.btn-secondary');
    const stickerino = element.querySelectorAll('.stickerino');
    if (buttons.length < 2 && stickerino.length < 1) {
        let button = document.createElement("button");
        button.setAttribute('type', 'button');
        button.className = "stickerino";
        item.style.height = "auto";

        const span = document.createElement('span');
        span.className = 'front items-center justify-center';

        const divi = document.createElement('div');
        divi.className = 'flex items-center';

        const buttonTextSpan = document.createElement('span');
        buttonTextSpan.textContent = 'Check Stickers';

        divi.appendChild(buttonTextSpan);
        span.appendChild(divi);
        button.appendChild(span);

        element.appendChild(button);

        button.addEventListener("click", () => {
            getStickers(button, imgElements, element);
        });
    }
}

async function getStickers(button, imgElements, element) {
    for (const imgElement of imgElements) {
        const altText = imgElement.alt;
        if (!altText.includes('undefined')) {
            const lastIndex = altText.lastIndexOf('-');
            const stickerName = altText.substring(0, lastIndex);
            const div = document.createElement("div");
            div.className = "stickerino";
            div.innerText = stickerName;
            element.appendChild(div);
            await getStickerValue(stickerName, div);
        }
    }
    button.parentNode.removeChild(button);
}

async function getStickerValue(sticker, div) {
    const url = 'https://steamcommunity.com/market/search/render/?query=' + encodeURI(sticker) + '&start=0&count=1&search_descriptions=0&sort_column=default&sort_dir=desc&appid=730&category_730_ItemSet[]=any&category_730_ProPlayer[]=any&category_730_StickerCapsule[]=any&category_730_TournamentTeam[]=any&category_730_Weapon[]=any&category_730_Quality[]=tag_normal&norender=1'

    console.log(url);

    chrome.runtime.sendMessage({ url: url }, (res) => {
        if (!res) {
            div.insertAdjacentText('afterend', 'F');
            return;
        }
        if (res.results[0].sell_price_text) {
            div.insertAdjacentText('afterend', res.results[0].sell_price_text);
            console.log(res.results[0].sell_price_text);
        }
    });

}