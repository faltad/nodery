var responses = require("./responses");
var matchmaking = require("./matchmaking");
var game = require("./game");

var routing = {
    "/test": function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello there");
	response.end();
    },
    "/" : function(request, response) {
	responses.staticFile(response, "/index.html");
    },
    "/request" : function(request, response) {
	matchmaking.requestMatch(request, response);
    },
    "/play" : function(request, response) {
	var postData = "";
	request.on("data", function(datum){
	    postData += datum;
	});
	request.on("end", function(datum){
	    if (request.method == "POST") {
		game.play(postData, request, response);
	    }
	});
    },
    "/wait" : function(request, response) {
	var postData = "";
	request.on("data", function(datum){
	    postData += datum;
	});
	request.on("end", function(datum){
	    if (request.method == "POST") {
		game.wait(postData, request, response);
	    }
	});
    }
};

exports.routing = routing;
