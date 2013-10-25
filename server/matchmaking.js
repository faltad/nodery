var game = require("./game");

var prevPlayer = null;


function Player(request, response) {
    this.gameReady = function (idGame, isTurn) {
	var data = {
	    id : idGame,
	    turn : isTurn,
	    msg: "go"
	};
	response.writeHead(200, {"Content-Type": "application/json"});
	response.write(JSON.stringify(data));
	response.end();
    }
    request.on("close", function() {
	prevPlayer = null;
    });
}

function requestMatch(request, response) {
    if (prevPlayer == null) {
	prevPlayer = new Player(request, response);
    } else {
	var newPlayer = new Player(request, response);
	var idGame = game.createGame();

	prevPlayer.gameReady(idGame, true);
	newPlayer.gameReady(idGame, false);
	prevPlayer = null;
    }
}

exports.requestMatch = requestMatch;
