// client code (with jquery)
// TODO:
// remove the big list of img in the html and generate it here


var isTurn = false;
var idGame = 0;
var myPoints = 0;


function updatePoints() {
    $("#points").text(myPoints);
}

function animationGameOver(res) {
    $("#game").hide(2000);
    $("#text-" + res).show();
    $("#end").show(2000)
}

function checkGame() {
    if ($("#game img[src='img/card.jpg']").length == 0) {
	if ($("#game img").length / 4 - myPoints > 0) {
	    animationGameOver("win");
	} else {
	    animationGameOver("loss");
	}
    }
}

function resetWrongCards(data) {
    $("#card-" + data.idCard).children().attr("src", "img/card.jpg");
    $("#card-" + data.prevCard).children().attr("src", "img/card.jpg");
}

function wait() {
    $.ajax({
	type: "POST",
	url: "/wait",
	data: {
	idGame : idGame
	}
    }).done(function(data) {
	if (data.terminate == true) {
	    animationGameOver("leave");
	} else {
	    isTurn = data.turn;
	    $("#card-" + data.idCard).children().attr("src", data.src);
	    checkGame();
	    if (data.turn == true) {
		window.setTimeout(resetWrongCards, 2000, data);
		$("#yourturn").show();
		$("#notturn").hide();
		isTurn = true;
	    } else {
		$("#notturn").show();
		wait();
	    }
	}
    });
}


$(document).ready(function(){
    $("#request").click(function(){
	$(this).hide();
	$("#waitingPlayer").show();
	$.ajax({
	    type: "POST",
	    url: "/request",
	    data: {}
	}).done(function(data) {
	    if (data.msg !== "end") {
		$("#matchmaking").hide();
		$("#game").show();
		isTurn = data.turn;
		idGame = data.id;
		if (data.turn == true) {
		    $("#yourturn").show();
		} else {
		    $("#notturn").show();
		    wait();
		}
	    }
	});
    });

    $("#game a").click(function(){
	var buff = $(this);
	// forbid the player to click on already used cards && if it is not
	// his turn
	if (isTurn == true &&
	    $(this).children().attr("src") == "img/card.jpg") {
	    var idCard = $(this).attr("id").substr(5);
	    $.ajax({
		type: "POST",
		url: "/play",
		data: {
		    idGame: idGame,
		    idCard : idCard
		}
	    }).done(function(data) {
		if (data.terminate == true) {
		    animationGameOver("leave");
		} else {
		    $("#card-" + data.idCard).children().attr("src", data.src);
		    myPoints += data.point;
		    updatePoints();
		    checkGame();
		    if (data.turn != true) {
			$("#notturn").show();
			$("#yourturn").hide();
			isTurn = false;
			window.setTimeout(resetWrongCards, 2000, data);
			wait();
		    }
		}
	    })
	}
	return false;
    })
});
