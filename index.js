var server = require("./server");
var routing = require("./server/routing");

server.start(routing.routing);
