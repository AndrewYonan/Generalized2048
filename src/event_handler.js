

document.addEventListener("keydown", (event) => {

    let dir = get_swipe_direction(event.key);
    if (dir != "~") {
        game_input_detected();
        board2048.take_game_turn(dir);
    } 
});



function get_swipe_direction(key) {
    if (is_left_input(key)) {
        return "a";
    }
    else if (is_right_input(key)) {
        return "d";
    }
    else if (is_up_input(key)) {
        return "w";
    }
    else if (is_down_input(key)) {
        return "s";
    }
    else {
        return "~";
    }
}


function is_left_input(key) {
    return key === "ArrowLeft" || key === "a" || key === "A";
}

function is_right_input(key) {
    return key === "ArrowRight" || key === "d" ||  key === "D";
}

function is_down_input(key) {
    return key === "ArrowDown" || key === "s" || key === "S";
}

function is_up_input(key) {
    return key === "ArrowUp" || key === "w" || key === "W";
}