var http = require("http");
var url = require("url");


function start(route, handle) { 
	var reqCount = 0
	function onReq(request, response) {
		reqCount += 1;
		var pathname = url.parse(request.url).pathname;
		route(handle, pathname, response, request);
	}

	http.createServer(onReq).listen(8888);

	console.log("Server Started");
};


exports.start = start;