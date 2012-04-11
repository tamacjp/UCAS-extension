
// backgroundのリクエストリスナ
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var res = {};
	if (request.cmd === 'enable') {
		// 有効化
		chrome.browserAction.setBadgeText({ 'tabId':sender.tab.id, 'text':'' + request.count });
	}
	sendResponse(res);
});

// browserActionクリック時処理
chrome.browserAction.onClicked.addListener(function(tab) {
	// convertリクエスト
	chrome.tabs.sendRequest(tab.id, { 'cmd':'convert' }, function(res) {
		if (res.count) {
			// 変換された
			chrome.browserAction.setBadgeText({ 'tabId':tab.id, 'text':'' });
		}
	});
});

