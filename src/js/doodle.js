$(() => {
	initializeCanvas();
	initializeListeners();
});

const WIDTH = 8;
const HEIGHT = 8;

var selectedSwatch;


function initializeCanvas() {
	var canvas = $("#canvas");
	for(var i=0; i<WIDTH; i++){
	var row = canvas.append("<div class='pixel-row'></div>")
		for(var j=0; j<HEIGHT; j++) {
			if((i+j) % 2){
				row.append("<div class='pixel grey'></div>")
			} else {
				row.append("<div class='pixel white'></div>")
			}
		}
	}
}

function initializeListeners() {
	$(".swatch").click(event => {
		$(".swatch").removeClass("selected");
		var tgt = $(event.target);
		tgt.addClass("selected");
		selectedSwatch = /color-\d+/.exec($(tgt).attr("class"))[0];
	});
	$(".pixel").click(event => {
		var tgt = $(event.target);
		console.log(tgt);
		if(selectedSwatch){
			$.each(["0","1","2","3"], num => tgt.removeClass("color-" + num));
			tgt.removeClass("white");
			tgt.removeClass("grey");
			tgt.addClass(selectedSwatch);
		}
	});
}