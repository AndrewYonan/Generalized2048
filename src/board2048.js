
class Board2048 {

    constructor() {
        
        this.rows = 5;
        this.cols = 7;
        this.tiles = [];
        this.renderer = new Board2048Renderer(this);

        this.swipe_complete = true;
        this.tiles_in_motion = [];

    }

    add_tile(row, col, val) {
        row = min(row, this.rows - 1);
        col = min(col, this.cols - 1);
        if (this.tile_at(row, col) == null) {
            this.tiles.push(new Tile2048(row, col, val, this.renderer));
        }
    }

    tile_at(row, col) {
        for (let tile of this.tiles) {
            if (tile.row == row && tile.col == col) return tile;
        }
        return null;
    }

    tiles_left_of(tile, board_mat) {
        let count = 0;
        let idx = tile.col - 1;
        while (idx >= 0) {
            if (board_mat[tile.row][idx--] != -1) count++
        } 
        return count;
    }

    tiles_right_of(tile, board_mat) {
        let count = 0;
        let idx = tile.col + 1;
        while (idx < this.cols) {
            if (board_mat[tile.row][idx++] != -1) count++
        } 
        return count;
    }

    tiles_above(tile, board_mat) {
        let count = 0;
        let idx = tile.row - 1;
        while (idx >= 0) {
            if (board_mat[idx--][tile.col] != -1) count++
        } 
        return count;
    }

    tiles_below(tile, board_mat) {
        let count = 0;
        let idx = tile.row + 1;
        while (idx < this.rows) {
            if (board_mat[idx++][tile.col] != -1) count++
        } 
        return count;
    }

    get_board_matrix_config() {
        let mat = [];
        for (let i = 0; i < this.rows; ++i) {
            let row = [];
            for (let j = 0; j < this.cols; ++j) {
                row.push(-1);
            } 
            mat.push(row);
        }
        for (let tile of this.tiles) {
            mat[tile.row][tile.col] = tile.val;
        }
        return mat;
    }


    set_tile_dest_positions(board_mat, swipe_dir) {

        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {

                if (board_mat[i][j] != -1) {

                    let tile = this.tile_at(i,j);

                    if (swipe_dir == "a") {
                        tile.set_target_col(this.tiles_left_of(tile, board_mat));
                    }
                    else if (swipe_dir == "d") {
                        tile.set_target_col(this.cols - 1 - this.tiles_right_of(tile, board_mat));
                    }
                    else if (swipe_dir == "w") {
                        tile.set_target_row(this.tiles_above(tile, board_mat));
                    }
                    else if (swipe_dir == "s") {
                        tile.set_target_row(this.rows - 1 - this.tiles_below(tile, board_mat));
                    }
                }
            }
        }
    }

    swipe(dir) {

        if (!this.swipe_complete) return;

        let board_mat = this.get_board_matrix_config();
        this.set_tile_dest_positions(board_mat, dir);

        this.swipe_complete = false;
        this.initiate_tile_swipe();
        
    }


    initiate_tile_swipe() {
        for (let tile of this.tiles) {
            tile.start_moving_to_target()
            this.tiles_in_motion.push(tile);
        }
    }

    update_tile_positions() {

        if (this.swipe_complete) return;

        for (let tile of this.tiles) {
            tile.update_position();
            if (!tile.moving_to_target) {
                if (this.tiles_in_motion.includes(tile)) {
                    this.tiles_in_motion = this.tiles_in_motion.filter(item => item !== tile);
                }
            }
        }
        if (this.tiles_in_motion.length == 0) {
            this.swipe_complete = true;
        }
    }

    draw() {
        this.renderer.draw();
    }
};