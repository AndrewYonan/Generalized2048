function init_test_board_config_1() {
    for (let i = 0; i < board2048.rows; ++i) {
        for (let j = 0; j < board2048.cols; ++j) {
            if (i + j == 4 || i + j == 5) {
                if (j % 2 == 0) {
                    board2048.add_tile(i, j, 2)
                }
                else {
                    board2048.add_tile(i, j, 4);
                }
                
            }
        }
    }
}


// for 1x3 grid
function init_test_board_config_2() {
    board2048.add_tile(0,0,4);
    board2048.add_tile(0,1,4);
    board2048.add_tile(0,2,8);
}

// for 4x4 grid
function init_test_board_config_3() {
    count = 0;
    for (let i = 0; i < board2048.rows; ++i) {
        for (let j = 0; j < board2048.cols; ++j) {
            board2048.add_tile(i, j, Math.pow(2, count++));
        }
    }
}