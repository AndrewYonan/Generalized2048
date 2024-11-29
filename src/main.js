const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const score_element = document.getElementById("game-score");
const high_score_element = document.getElementById("game-high-score");
const restart_button_element = document.getElementById("restart-button");
const game_over_screen = document.getElementById("game-over-screen");
const W = 1200;
const H = 750;

const BOARD_ROWS = 5;
const BOARD_COLS = 5;
var board2048;
var iterator = setInterval(frame, 16);
var game_idle = false;
var tick = 0;
var last_active_tick = 0;
var idle_threshold = 50;
var GLOBAL_SCORE = 0;
var GLOBAL_HIGH_SCORE = 0;
var GLOBAL_GAME_OVER = false;


restart_button_element.addEventListener("click", (event) => {
    start_new_game();
    game_input_detected();
});


init_canvas_params();
start_new_game();



function frame() {

    if (tick - last_active_tick > idle_threshold) {
        stop_iterator();
        return;
    }

    if (board2048.game_over()) {
        setTimeout(set_end_screen_visible, 1200, true);
        GLOBAL_GAME_OVER = true;
    } 

    clear_canvas(canvas, ctx);

    board2048.draw();
    board2048.update_tiles();
    update_score();

    tick++;

}

function start_new_game() {

    set_end_screen_visible(false);
    board2048 = new Board2048(BOARD_ROWS, BOARD_COLS);
    tick = 0;
    last_active_tick = 0;
    GLOBAL_SCORE = 0;
    GLOBAL_GAME_OVER = false;
    init_board();

}

function set_end_screen_visible(bool) {
    if (bool) {
        game_over_screen.classList.remove("hidden");
        game_over_screen.classList.add("visible");
    }
    else {
        game_over_screen.classList.remove("visible");
        game_over_screen.classList.add("hidden");
    }
    
}


function init_board() {
    //init_test_board_config_2();
    board2048.add_random_tile();
    board2048.add_random_tile();
}



function update_score() {

    if (GLOBAL_SCORE > GLOBAL_HIGH_SCORE) {
        GLOBAL_HIGH_SCORE = GLOBAL_SCORE;
    }

    score_element.innerHTML = "Score : " + GLOBAL_SCORE.toString();
    high_score_element.innerHTML = "High Score : " + GLOBAL_HIGH_SCORE.toString();

}

function game_input_detected() {
    if (!GLOBAL_GAME_OVER) {
        start_iterator();
        last_active_tick = tick;
    }
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