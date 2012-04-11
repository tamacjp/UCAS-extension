
function procDocument(conv) {
	var count = 0;

	// jQueryを使うまでもない。全ノード走査してテキストノードを書き換える。
	function procNode(node) {
		switch (node.nodeType) {
		case 1/*Node.ELEMENT_NODE*/:
			procElementNode(node);
			break;

		case 3/*Node.TEXT_NODE*/:
			procTextNode(node);
			break;
		}
	}

	function procTextNode(node) {
		node.textContent = node.textContent.replace(/[\u1401-\u167F]{2}/g, function(m) {
			count += 1;
			if (conv) {
				var code = (m.charCodeAt(0) - 0x1400) + ((m.charCodeAt(1) - 0x1400) * 639);
				return String.fromCharCode(code);
			} else {
			return m;
			}
		});
	}

	function procElementNode(node) {
		for (var index = 0, len = node.childNodes.length; index < len; index++) {
			procNode(node.childNodes[index]);
		}
	}

	procNode(document.body);
	return count;
}

// 事前処理で変換対象ウキャスを数える
(function() {
	var count = procDocument();
	if (count > 0) {
		// 件数通知
		chrome.extension.sendRequest({ 'cmd':'enable', 'count':count }, function(res) {});
	}
})();

// contentのリクエストリスナ
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var res = {};
	if (request.cmd == 'convert') {
		// convert指示
		res.count = procDocument(true);
	}
	sendResponse(res);
});

