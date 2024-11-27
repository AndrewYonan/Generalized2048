
class Board2048Renderer {

    constructor(board) {

        this.board = board;
        this.cols = this.board.cols;
        this.rows = this.board.rows;

    }

    board_upper_left_x() {
        return W/2 - (TILE_SIZE * this.cols)/2 - (this.cols * TILE_MARGIN/2) - TILE_MARGIN/2;
    }

    board_upper_left_y() {
        return H/2 - (TILE_SIZE * this.rows)/2 - (this.rows * TILE_MARGIN)/2 - TILE_MARGIN/2;
    }

    board_size_x() {
        return this.cols * TILE_SIZE + this.cols * TILE_MARGIN + TILE_MARGIN;
    }

    board_size_y() {
        return this.rows * TILE_SIZE + this.rows * TILE_MARGIN + TILE_MARGIN;
    }

    draw_board() {

        let x = this.board_upper_left_x();
        let y = this.board_upper_left_y();
        let width = this.board_size_x();
        let height = this.board_size_y();

        ctx.fillStyle = BOARD_COLOR;
        rounded_rect(x, y, width, height, TILE_ROUNDING);
        ctx.fill();

    }

    draw_board_slots() {

        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                
                let x = this.board_upper_left_x() + TILE_MARGIN + (TILE_SIZE + TILE_MARGIN) * j;
                let y = this.board_upper_left_y() + TILE_MARGIN + (TILE_SIZE + TILE_MARGIN) * i;

                ctx.fillStyle = EMPTY_TILE_SLOT_COLOR;
                rounded_rect(x, y, TILE_SIZE, TILE_SIZE, TILE_ROUNDING);
                ctx.fill();

            }
        }
    }

    draw_empty_board() {
        this.draw_board();
        this.draw_board_slots();
    }

    draw_tiles() {
        for (let tile of this.board.tiles) {
            tile.draw();
        }
    }

    draw() {
        this.draw_empty_board();
        this.draw_tiles();
    }

};