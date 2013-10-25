var http = require("http");
var fs = require("fs");
var url = require("url");
var responses = require("./server/responses");

function start(routing) {
    function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
	
	if (pathname in routing != false) {
            routing[pathname](request, response);
	} else { // test if file exists in static/
	    responses.staticFile(response, pathname);
	}
    }
    http.createServer(onRequest).listen(8888);
}

exports.start = start;
