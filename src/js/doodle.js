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
				row.append("<div class='pixel color-1'></div>")
			} else {
				row.append("<div class='pixel color-0'></div>")
			}
		}
	}
}

function initializeListeners() {
	$(".swatch").click(event => {
		$(".swatch").removeClass("selected");
		var tgt = $(event.target);
		tgt.addClass("selected");
                selectedSwatch = getColorOfPixel(tgt);
	});
	$(".pixel").mouseover(event => {
                if(event.which == 1){
        	    var tgt = $(event.target);
        	    if(selectedSwatch){
        		$.each(["0","1","2","3"], num => tgt.removeClass("color-" + num));
                        tgt.addClass(selectedSwatch);
        	    }
                }
	});;
	$(".pixel").mousedown(event => {
            var tgt = $(event.target);
            if(selectedSwatch){
                $.each(["0","1","2","3"], num => tgt.removeClass("color-" + num));
                tgt.addClass(selectedSwatch);
            }
	})
}

function getCurrentCanvasDrawing() {
    var colorArray = $(".pixel")
        .map((i,p) => getColorOfPixel(p))
        .map((i,c) => Number(c.split("-")[1]));
    var byteArray = [];
    while(colorArray.length){
        byteArray.push(colorArray.splice(0,8));
    }
    byteArray = byteArray
        .map(b => b
                .map(pix => {return {up: Math.floor(pix/2), down: pix%2}})
                .reduce((prev, curr, i, arr) => {
                    var bit = 3-(i%4);
                    if(bit == 3)
                        prev.push({high:0, low:0})
                    prev[prev.length - 1].high += (curr.up << bit);
                    prev[prev.length - 1].low += (curr.down << bit);
                    return prev;
                },[])
            )
        .map(b => "$" + b[0].high.toString(16) + b[1].high.toString(16) + ", $" + b[0].low.toString(16) + b[1].low.toString(16) + ", ")
        .join("")
        .slice(0,-2)
    return byteArray;
}

function getColorOfPixel(pix) {
    return /color-\d+/.exec($(pix).attr("class"))[0];
}
