var listGames = new Array();
var responses = require("./responses");
var querystring = require("querystring");

function Game(id) {
    var listNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var totalCell = listNumbers.length;
    var tab = new Array();
    var rand = 0;

    while (totalCell > 0) {
	rand = Math.floor(Math.random() * (totalCell) + 1) - 1;
	totalCell--;
	tab[totalCell] = listNumbers[rand];
	listNumbers.splice(rand, 1);
    }

    var waitingPlayer = null;
    var lastPickedCard = 0;
    var terminate = false;
    this.getCard = function(card) {
	var data = {};
	var waitingPlayerData = {};

	if (terminate == true) {
	    data.terminate = true;
	    return data;
	}

	data.terminate = false;

	if (tab[lastPickedCard - 1] != tab[card - 1] && lastPickedCard != 0) {
	    data.turn = false;
	    data.point = 0;
	    waitingPlayerData.turn = true;
	    waitingPlayerData.point = 0;
	} else {
	    data.turn = true;
	    if (lastPickedCard != 0) {
		data.point = 1;
	    } else {
		data.point = 0;
	    }
	    waitingPlayerData.turn = false;
	    waitingPlayerData.point = 0;
	}
	waitingPlayerData.prevCard = data.prevCard = lastPickedCard;
	lastPickedCard = card;
	if (data.turn == false || data.point == 1) {
	    lastPickedCard = 0;
	}	    
	data.src = "img/card-" + tab[card - 1] + ".jpg";
	waitingPlayerData.src = data.src;
	if (waitingPlayer != null) {
	    waitingPlayerData.idCard = card;
	    waitingPlayer.answer(waitingPlayerData);
	}
	return data;
    };
    this.setWaitingPlayer = function(player) {
	waitingPlayer = player;
    }

    this.setTermination = function() {
	terminate = true;
	setTimeout(removeGame, 20000, id);
    }
}


// Remove game from the list in case of timeout
function removeGame(id) {
    listGames.splice(id, 1);
}

function Player(request, response, gameId) {
    this.answer = function(data) {
	response.writeHead(200, {"Content-Type": "application/json"});
	response.write(JSON.stringify(data));
	response.end();
    }

    request.on("close", function() {
	listGames[gameId].setTermination();
    });

}

function createGame() {
    var rand = 0;
    while (rand in listGames) {
	rand = Math.floor(Math.random() * 1001);
    }
    var newGame = new Game(rand);
    listGames[rand] = newGame;
    return rand;
}

function play(postData, request, response) {
    var body = querystring.parse(postData);
    if ("idGame" in body == true && "idCard" in body == true &&
	body.idGame in listGames == true) {
	var data = listGames[body.idGame].getCard(body.idCard);
	data.idCard = body.idCard;
	var newPlayer = new Player(request, response, body.idGame);
	newPlayer.answer(data);
    } else {
	responses.send403(response, "");
    }
}

function wait(postData, request, response) {
    var body = querystring.parse(postData);
    if ("idGame" in body && 
	body.idGame in listGames == true) {
	var player = new Player(request, response, body.idGame);
	listGames[body.idGame].setWaitingPlayer(player);
    } else {	
	responses.send403(response, "");
    }
}

exports.createGame = createGame;
exports.play = play;
exports.wait = wait;
