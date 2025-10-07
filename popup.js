document.addEventListener('DOMContentLoaded', function() {
    const actionBtn = document.getElementById('actionBtn');
    const result = document.getElementById('result');

    actionBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            result.innerHTML = `<p>Current tab: ${currentTab.title}</p>`;
        });
    });
});