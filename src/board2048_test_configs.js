function init_test_board_config_3() {
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