const board_select_menu = document.querySelector(".dropdown-menu");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const score_element = document.getElementById("game-score");
const high_score_element = document.getElementById("game-high-score");
const restart_button_element = document.getElementById("restart-button");
const game_over_screen = document.getElementById("game-over-screen");
const num_board_menu_opts = get_num_board_menu_opts();
const W = 1200;
const H = 750;

var board_rows = 4;
var board_cols = 4;
var game_over_timeout_id;
var board2048;
var iterator = setInterval(frame, 16);
var game_idle = false;
var tick = 0;
var last_active_tick = 0;
var idle_threshold = 50;
var GLOBAL_SCORE = 0;
var GLOBAL_HIGH_SCORE = 0;
var GLOBAL_GAME_OVER = false;



set_restart_button_click_listener();
set_board_menu_option_click_listeners();
set_board_menu_option_ids();
init_canvas_params();
start_new_game();





function extract_board_dimensions_from_button_text(str) {
    const regex = /(\d+)\s*x\s*(\d+)/;
    const match = str.match(regex);
    if (match) return [parseInt(match[1], 10), parseInt(match[2], 10)]; 
    return null;
}


function get_num_board_menu_opts() {
    Array.from(board_select_menu.children).length;

}

function set_board_menu_option_ids() {
    let menu_items = Array.from(board_select_menu.children);
    menu_items.forEach((button, idx) => {
        button.id = `board-${idx + 1}`;
    });
}

function set_board_menu_option_click_listeners() {  
    let menu_items = Array.from(board_select_menu.children);
    menu_items.forEach(button => {
        button.addEventListener("click", () => {
            let board_dims = extract_board_dimensions_from_button_text(button.innerHTML);
            board_rows = board_dims[0];
            board_cols = board_dims[1];
            start_new_game();
        });
    });
}


function set_restart_button_click_listener() {
    restart_button_element.addEventListener("click", () => {
        start_new_game();
    });
}

function frame() {

    if (tick - last_active_tick > idle_threshold) {
        stop_iterator();
        return;
    }

    if (!GLOBAL_GAME_OVER && board2048.game_over()) {
        game_over_timeout_id = setTimeout(set_end_screen_visible, 1200, true);
        GLOBAL_GAME_OVER = true;
    } 

    clear_canvas(canvas, ctx);

    board2048.draw();
    board2048.update_tiles();
    update_score();

    tick++;

}

function start_new_game() {

    GLOBAL_GAME_OVER = false;
    cancel_game_over_screen_timeout()
    set_end_screen_visible(false);
    game_input_detected();
    board2048 = new Board2048(board_rows, board_cols);
    tick = 0;
    last_active_tick = 0;
    GLOBAL_SCORE = 0;
    init_board();

}

function cancel_game_over_screen_timeout() {
    if (game_over_timeout_id) {
        clearTimeout(game_over_timeout_id);
        game_over_timeout_id = null;
    }
}


function set_end_screen_visible(bool) {
    if (bool) {
        game_over_screen.style.display = 'block';
        game_over_screen.classList.add("visible");
    }
    else {
        game_over_screen.style.display = 'none';
        game_over_screen.classList.remove("visible");
    }
    
}


function init_board() {
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