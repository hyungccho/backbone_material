function route(handleMatcher, pathname, response, request) {
	console.log("About to route a request for " + pathname);

	if (typeof handleMatcher[pathname] === 'function') {
		handleMatcher[pathname](response, request);
	} else {
		console.log("404 not found");
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("Content not found");
		response.end();
	}
}

exports.route = route