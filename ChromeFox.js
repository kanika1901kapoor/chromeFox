


chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('ChromeFox.html')}, function(tab) {
    // Tab opened.
  });
});


