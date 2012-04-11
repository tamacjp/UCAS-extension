
// backgroundのリクエストリスナ
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var res = {};
	if (request.cmd === 'enable') {
		// pageAction有効化
		var count = request.count;
		chrome.pageAction.setTitle({ 'tabId':sender.tab.id, 'title':'has ' + count + ' letters' });
		chrome.pageAction.show(sender.tab.id);
	}
	sendResponse(res);
});

// pageActionクリック時処理
chrome.pageAction.onClicked.addListener(function(tab) {
	// convertリクエスト
	chrome.tabs.sendRequest(tab.id, { 'cmd':'convert' }, function(res) {
		if (res.count) {
			// 変換された
			chrome.pageAction.setTitle({ 'tabId':tab.id, 'title':'decoded ' + res.count + ' letters' });
			chrome.pageAction.show(sender.tab.id);
		}
	});
});

