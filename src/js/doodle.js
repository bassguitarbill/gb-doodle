$(() => {
    initializeCanvas();
    initializeListeners();
});

const WIDTH = 8;
const HEIGHT = 8;

const COLOR_MAP = {
    3: "#0f380f",
    2: "#306230",
    1: "#8bac0f",
    0: "#9bbc0f"
}

var selectedSwatch;
var pixelArray = new Array(WIDTH * HEIGHT);

var hscale = ctx => ctx.canvas.width / WIDTH;
var vscale = ctx => ctx.canvas.height / HEIGHT;

function initializeCanvas() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    for(var i=0; i<WIDTH; i++){
        for(var j=0; j<HEIGHT; j++){
            colorPixel(ctx, i, j, ((i+j)%2) ? "1" : "0")
        }
    }
}

function colorPixel(ctx, width, height, color) {
    ctx.fillStyle = COLOR_MAP[color];
    ctx.fillRect(width*hscale(ctx), height*vscale(ctx), hscale(ctx), vscale(ctx));
    pixelArray[width + (height*HEIGHT)] = color;
}

function initializeListeners() {
    $(".swatch").click(event => {
        $(".swatch").removeClass("selected");
        var tgt = $(event.target);
        tgt.addClass("selected");
        selectedSwatch = getColorOfPixel(tgt);
    });

    var ctx = document.getElementById("canvas").getContext("2d");
    $("#canvas").mousemove(event => {
        if(event.which == 1){
            var x = Math.floor(event.offsetX/hscale(ctx));
            var y = Math.floor(event.offsetY/vscale(ctx));
            colorPixel(ctx, x, y, selectedSwatch);
        }
    });

}

function getCurrentCanvasDrawing() {
    var colorArray = pixelArray.slice();
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
    return /color-\d+/.exec($(pix).attr("class"))[0].split("-")[1];
}

function addLibraryTile() {
    blobUtil.canvasToBlob(document.getElementById("canvas"))
        .then(blobUtil.blobToBase64String)
        .then(str => $(".tile-library").append("<img class='library-tile' src='data:image/png;base64," + str + "' />"))
}
