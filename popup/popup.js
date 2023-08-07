document.addEventListener('DOMContentLoaded', function () {
    const intervalInput = document.getElementById('intervalInput');
    const rateInput = document.getElementById('rateInput');
    const saveButton = document.getElementById('saveButton');
  
    saveButton.addEventListener('click', function () {
      const intervalValue = intervalInput.value;
      const rateValue = rateInput.value;
      if (intervalValue !== '' && rateValue !== '') {
        chrome.runtime.sendMessage({ action: 'saveInterval', intervalValue: intervalValue });
        chrome.runtime.sendMessage({ action: 'saveRate', rateValue: rateValue });
      }
    });
  });
  