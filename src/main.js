const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const W = 1200;
const H = 750;
const board2048 = new Board2048();

var iterator = setInterval(frame, 16);
var game_idle = false;
var tick = 0;
var last_active_tick = 0;
var idle_threshold = 50;



init_canvas_params();

board2048.add_tile(0,2,2);
board2048.add_tile(0,3,2);
board2048.add_tile(0,4,2);
board2048.add_tile(0,6,2);
board2048.add_tile(2,4,2);
board2048.add_tile(2,2,2);
board2048.add_tile(2,0,2);
board2048.add_tile(4,6,4096);
board2048.add_tile(3,1,2);



function frame() {

    if (tick - last_active_tick > idle_threshold) {
        stop_iterator();
        return;
    }

    // console.log("(", tick, ", ", last_active_tick, ")");
    clear_canvas(canvas, ctx);
    board2048.draw();
    board2048.update_tiles();
    show_canvas_center();
    tick++;

}

function game_input_detected() {
    start_iterator();
    last_active_tick = tick;
}


function start_iterator() {
    if (game_idle) {
        game_idle = false;
        iterator = setInterval(frame, 16);
        console.log("started iterator...");
    }
    else {
        console.log("active iterator already exists");
    }
    
}

function stop_iterator() {

    game_idle = true;

    if (iterator) {
        clearInterval(iterator);
        console.log("stopped iterator...");
    }
    else {
        console.log("no iterator exists to stop");
    }
    
}

function init_canvas_params() {

    canvas.width = W;
    canvas.height = H;
    canvas.style.marginTop = "40px";
    canvas.style.backgroundColor = BG_MAIN_COLOR;
    canvas.style.position = "absolute";
    canvas.style.left = "50%";
    canvas.style.marginLeft = "-" + (W/2).toString() + "px";
    document.body.style.backgroundColor = BG_MAIN_COLOR;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

}