$(() => {
    initializePixelArray();
    draw();
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

var selectedSwatch = 0;
var showGridLines = true;
var pixelArray = [];

var hscale = ctx => ctx.canvas.width / WIDTH;
var vscale = ctx => ctx.canvas.height / HEIGHT;

function drawPixel(ctx, width, height, color) {
    ctx.fillStyle = COLOR_MAP[color];
    ctx.fillRect(width*hscale(ctx), height*vscale(ctx), hscale(ctx), vscale(ctx));
}

function draw() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    for(var x=0; x<WIDTH; x++){
        for(var y=0; y<HEIGHT; y++){
            drawPixel(ctx, x, y, pixelArray[x][y])
        }
    }
}

function initializePixelArray() {
    for(var i = 0; i < WIDTH; i++) {
        pixelArray.push([]);
        for(var j = 0; j < HEIGHT; j++) {
            pixelArray[i].push((i+j)%2);
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

    var ctx = document.getElementById("canvas").getContext("2d");
    $("#canvas").mousemove(event => {
        if(event.which == 1){
            var x = Math.floor(event.offsetX/hscale(ctx));
            var y = Math.floor(event.offsetY/vscale(ctx));
            pixelArray[x][y] = selectedSwatch;
            draw();
        }
    });
    $("#canvas").click(event => {
        var x = Math.floor(event.offsetX/hscale(ctx));
        var y = Math.floor(event.offsetY/vscale(ctx));
        pixelArray[x][y] = selectedSwatch;
        draw();
    });


}

function getCurrentCanvasDrawing() {
    // We have to flip the pixelArray diagonally
    // Right now it's a row of columns, and we need the data row-by-row
    return pixelArray.reduce((acc, cv) => {
        cv.forEach((v, i) => {
            !acc[i] ? acc.push([v]) : acc[i].push(v);
        });
        return acc;
    }, []).map(row => {
        // Each row maps to two bytes
        // First byte is the LSB of each pixel from L to R
        // Second byte is the upper bit
        var lo = 0, hi = 0;
        row.forEach((p, i) => {
            lo += p%2 ? (1 << (7-i)) : 0;
            hi += p>1 ? (1 << (7-i)) : 0;
        });
        return [lo, hi];
    }).reduce((acc, cv) => acc.concat(cv), []);
}

var saveByteArray = (data, name, mimeType) => {
    var blob = new Blob(data, {type: mimeType});
    saveAs(blob, name);
/*
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href=url;
    a.download = name;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
*/
    
};

function getColorOfPixel(pix) {
    return Number(/color-\d+/.exec($(pix).attr("class"))[0].split("-")[1]);
}

function addLibraryTile() {
    blobUtil.canvasToBlob(document.getElementById("canvas"))
        .then(blobUtil.blobToBase64String)
        .then(str => $(".tile-library").append("<img class='library-tile' src='data:image/png;base64," + str + "' />"))
}
