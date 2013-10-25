var listType = {
    ".html" : "text/html",
    ".js" : "text/javascript",
    ".css" : "text/css",
    ".jpg" : "image/jpeg"
};

var fs = require("fs");

function send404(response, pathname) {
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("Error 404");
    console.log("Warning: 404 with : " + pathname);
    response.end();
}

function send403(response, pathname) {
    response.writeHead(403, {"Content-Type": "text/html"});
    response.write("Error 403 : Forbidden!");
    console.log("Warning: 403 with : " + pathname);
    response.end();
}

function send500(response, pathname) {
    response.writeHead(500, {"Content-Type": "text/html"});
    response.write("Error 500");
    console.log("Warning: 500 with : " + pathname);
    response.end();
}

function staticFile(response, pathname) {
    fs.stat("client" + pathname, function(err, stat) {
	if (!err) {
	    fs.readFile("client" + pathname, function(err, contents) {
		if (!err) {
		    var ext = pathname.substr(pathname.lastIndexOf("."));
		    response.writeHead(200, {"Content-Type": listType[ext]});
		    response.write(contents);
		    response.end();
		} else {
		    send500(response, pathname);
		}
	    });
	} else {
	    send404(response, pathname);
	}
    });
}

exports.staticFile = staticFile;
exports.send403 = send403;
exports.send404 = send404;
exports.send500 = send500;

