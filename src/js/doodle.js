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
				row.append("<div class='pixel color-2'></div>")
			} else {
				row.append("<div class='pixel color-3'></div>")
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
