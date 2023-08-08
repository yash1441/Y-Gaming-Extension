function checkAndAppendText(rate) {
    readMatchingDivs(rate);
}

checkAndAppendText();

chrome.storage.local.get(['intervalValue'], function (result) {
    const intervalInSeconds = result.intervalValue || 5;
    chrome.storage.local.get(['rateValue'], function (result) {
        const rate = result.rateValue || 59.5;
        setInterval(checkAndAppendText, intervalInSeconds * 1000, rate);
    });
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
                const content = coinChild.textContent;
                if (!content.includes('(')) {
                    const coins = parseFloat(content.replace(/,/g, ''));
                    const updatedContent = content + ' (₹' + (coins * rate).toFixed(2).toString() + ')';
                    const newText = document.createTextNode(updatedContent);
                    coinChild.innerHTML = '';
                    coinChild.appendChild(newText);
                } else {
                    const coins = parseFloat(content.replace(/,/g, '').split(" ")[1]).toFixed(2);
                    const value = parseFloat(content.match(/\((.*?)\)/)[1].replace(/[^\d.]/g, '')).toFixed(2);
                    if ((coins * rate).toFixed(2) != value) {
                        const updatedContent = content + ' (₹' + (coins * rate).toFixed(2).toString() + ')';
                        const newText = document.createTextNode(updatedContent);
                        coinChild.innerHTML = '';
                        coinChild.appendChild(newText);
                    }
                }
            }
        }
    }
}

async function getStickerValue(sticker, image) {
    const url = 'https://steamcommunity.com/market/search/render/?query=' + encodeURI(sticker) + '&start=0&count=1&search_descriptions=0&sort_column=default&sort_dir=desc&appid=730&category_730_ItemSet[]=any&category_730_ProPlayer[]=any&category_730_StickerCapsule[]=any&category_730_TournamentTeam[]=any&category_730_Weapon[]=any&category_730_Quality[]=tag_normal&norender=1'

    console.log(url);

    chrome.runtime.sendMessage({ url: url }, (res) => {
        if (!res) {
            image.insertAdjacentText('afterend', 'F');
            return;
        }
        if (res.results[0].sell_price_text) {
            image.insertAdjacentText('afterend', res.results[0].sell_price_text);
            console.log(res.results[0].sell_price_text);
        }
    });

}

async function checkStickers(item) {
    let element = item.firstElementChild;
    if (element.className.startsWith("item__special")) element = item.children[1];
    const stickersDiv = element.querySelector('.stickers');
    let imgElements = [];

    if (stickersDiv) imgElements = stickersDiv.querySelectorAll('img');
    else return;

    if (imgElements[0].alt.includes('undefined')) return;

    const buttons = element.querySelectorAll('.btn-secondary');
    const stickerino = element.querySelectorAll('.stickerino');
    if (buttons.length < 2 && stickerino.length < 1) {
        let button = document.createElement("button");
        button.type = "button";
        button.className = "btn-secondary pop stretch flex rounded font-[500] text-dark-5";
        item.style.height = "auto";
        let divi = document.createElement("div");
        divi.className = "flex items-center";
        divi.innerText = "Check Stickers";
        button.appendChild(divi);
        element.appendChild(button);
        button.addEventListener("click", () => {
            for (const imgElement of imgElements) {
                const altText = imgElement.alt;
                if (!altText.includes('undefined')) {
                    const lastIndex = altText.lastIndexOf('-');
                    const stickerName = altText.substring(0, lastIndex);
                    const div = document.createElement("div");
                    div.className = "stickerino";
                    div.innerText = stickerName;
                    element.appendChild(div);
                    //await getStickerValue(stickerName, imgElement);
                }
            }
            button.parentNode.removeChild(button);
        });
    }

    
}