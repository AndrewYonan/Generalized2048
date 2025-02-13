
/* NOTES : set_left_adjacent_merge_tiles() implements a left-hand merge policy,
    where matching tiles merge in pairs starting from the left.
    Hence the correctness of the method depends
    on traversing the tiles from left to right while
    assigning merge pairs (the merging status of tiles
    on the right depend on the alread-assigned merging 
    status of the tiles on the left)
    
    Q - could all 4 set_adjacent_merge_tile methods
    be generalized into 1? (seems difficult) */


class Board2048 {

    constructor(rows, cols) {
        
        this.rows = rows;
        this.cols = cols;
        this.tiles = [];
        this.renderer = new Board2048Renderer(this);
        this.swipe_complete = true;
        this.tiles_in_motion = [];

        this.auto_turn_sequence = ["a", "w", "d", "s"];
        this.auto_turn_idx = 0;

        if (AUTO_TURNS) this.take_auto_turn();

    }

    take_game_turn(swipe_dir) {
        game_input_detected();
        this.swipe(swipe_dir);
    }

    take_auto_turn() {
        if (this.game_over()) return;
        this.take_game_turn(this.auto_turn_sequence[(this.auto_turn_idx++) % this.auto_turn_sequence.length]);
    }

    finish_swipe() {
        this.swipe_complete = true;
        this.add_random_tile();
        if (AUTO_TURNS) this.take_auto_turn();
        
    }  

    add_random_tile() {

        let board_mat = this.get_board_matrix_config();
        let avail_spots = [];
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                if (board_mat[i][j] == -1) {
                    avail_spots.push([i, j]);
                }
            }
        }

        let ranks = [2,4];
        let rand_pos = avail_spots[randint(0, avail_spots.length - 1)];
        let rand_rank = ranks[randint(0, ranks.length - 1)]

        if (avail_spots.length > 0) {
            this.add_tile(rand_pos[0], rand_pos[1], rand_rank);
        }
        
    }

    is_adjacent(tile_1, tile_2) {
        if (tile_1 == null || tile_2 == null) return false;
        return ((tile_1.row == tile_2.row) && (Math.abs(tile_1.col - tile_2.col) == 1)) ||
                ((tile_1.col == tile_2.col) && (Math.abs(tile_1.row - tile_2.row) == 1));
    }

    can_merge(tile_1, tile_2) {
        if (tile_1 == null || tile_2 == null) return false;
        return (tile_1.val == tile_2.val);
    }

    immediate_adj(tile, dir) {
        if (dir == "left") return this.tile_at(tile.row, tile.col - 1);
        else if (dir == "right") return this.tile_at(tile.row, tile.col + 1);
        else if (dir == "up") return this.tile_at(tile.row - 1, tile.col);
        else if (dir == "down") return this.tile_at(tile.row + 1, tile.col);
    }

    game_over() {

        if (this.swipe_complete == false) return false;
        if (this.tiles.length < this.rows * this.cols) return false;

        for (let tile of this.tiles) {

            if (this.can_merge(tile, this.immediate_adj(tile, "left"))) return false;
            if (this.can_merge(tile, this.immediate_adj(tile, "right"))) return false;
            if (this.can_merge(tile, this.immediate_adj(tile, "up"))) return false;
            if (this.can_merge(tile, this.immediate_adj(tile, "down"))) return false;

        }

        return true;
    }

    add_tile(row, col, val, merge_status=false) {
        row = min(row, this.rows - 1);
        col = min(col, this.cols - 1);
        if (this.tile_at(row, col) == null) {
            this.tiles.push(new Tile2048(row, col, val, merge_status, this.renderer));
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
            if (board_mat[tile.row][idx--] != -1) count++;
        } 
        return count;
    }

    num_non_merge_tiles_left_of(tile) {
        let count = 0;
        let idx = tile.col - 1;
        while (idx >= 0) {
            let cur_tile = this.tile_at(tile.row, idx--);
            if (cur_tile != null) {
                if (cur_tile.merge_tile == null) count++
            }
        } 
        return count;
    }

    num_non_merge_tiles_right_of(tile) {
        let count = 0;
        let idx = tile.col + 1;
        while (idx <= this.cols - 1) {
            let cur_tile = this.tile_at(tile.row, idx++);
            if (cur_tile != null) {
                if (cur_tile.merge_tile == null) count++
            }
        } 
        return count;
    }

    num_non_merge_tiles_above(tile) {
        let count = 0;
        let idx = tile.row - 1;
        while (idx >= 0) {
            let cur_tile = this.tile_at(idx--, tile.col);
            if (cur_tile != null) {
                if (cur_tile.merge_tile == null) count++
            }
        } 
        return count;
    }


    num_non_merge_tiles_below(tile) {
        let count = 0;
        let idx = tile.row + 1;
        while (idx <= this.rows - 1) {
            let cur_tile = this.tile_at(idx++, tile.col);
            if (cur_tile != null) {
                if (cur_tile.merge_tile == null) count++
            }
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


    get_left_adj_tile(tile, board_mat) {
        let k = tile.col - 1;
        while (k >= 0 && board_mat[tile.row][k] == -1) --k;
        if (k < 0) return null;
        return this.tile_at(tile.row, k);
    }

    get_right_adj_tile(tile, board_mat) {
        let k = tile.col + 1;
        while (k <= this.cols - 1 && board_mat[tile.row][k] == -1) ++k;
        if (k > this.cols - 1) return null;
        return this.tile_at(tile.row, k);
    }

    get_up_adj_tile(tile, board_mat) {
        let k = tile.row - 1;
        while (k >= 0 && board_mat[k][tile.col] == -1) --k;
        if (k < 0) return null;
        return this.tile_at(k, tile.col);
    }

    get_down_adj_tile(tile, board_mat) {
        let k = tile.row + 1;
        while (k <= this.rows - 1 && board_mat[k][tile.col] == -1) ++k;
        if (k > this.rows - 1) return null;
        return this.tile_at(k, tile.col);
    }


    set_adjacent_merge_tiles(board_mat, dir) {

        if (dir == "a") { //left
            this.set_left_adjacent_merge_tiles(board_mat);
        }
        else if (dir == "d") { //right
            this.set_right_adjacent_merge_tiles(board_mat);
        }
        else if (dir == "w") { //up
            this.set_up_adjacent_merge_tiles(board_mat);
        }
        else if (dir == "s") { //down
            this.set_down_adjacent_merge_tiles(board_mat);
        }
         
        
    }

    set_left_adjacent_merge_tiles(board_mat) {

        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                
                if (board_mat[i][j] == -1) continue;

                let tile = this.tile_at(i, j)
                let left_adj_tile = this.get_left_adj_tile(tile, board_mat);

                if (left_adj_tile == null) continue;

                if (left_adj_tile.merge_tile == null && this.can_merge(left_adj_tile, tile)) {
                    tile.merge_tile = left_adj_tile;
                }
            }
        }
    }   

    set_right_adjacent_merge_tiles(board_mat) {
        
        for (let i = 0; i < this.rows; ++i) {
            for (let j = this.cols - 1; j >= 0; --j) {
                
                if (board_mat[i][j] == -1) continue;

                let tile = this.tile_at(i, j)
                let right_adj_tile = this.get_right_adj_tile(tile, board_mat);

                if (right_adj_tile == null) continue;

                if (right_adj_tile.merge_tile == null && this.can_merge(right_adj_tile, tile)) {
                    tile.merge_tile = right_adj_tile;
                }
            }
        }
    }


    set_up_adjacent_merge_tiles(board_mat) {

        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                
                if (board_mat[i][j] == -1) continue;

                let tile = this.tile_at(i, j)
                let up_adj_tile = this.get_up_adj_tile(tile, board_mat);

                if (up_adj_tile == null) continue;

                if (up_adj_tile.merge_tile == null && this.can_merge(up_adj_tile, tile)) {
                    tile.merge_tile = up_adj_tile;
                }
            }
        }
    }


    set_down_adjacent_merge_tiles(board_mat) {

        for (let i = this.rows - 1; i >= 0; --i) {
            for (let j = 0; j < this.cols; ++j) {
                
                if (board_mat[i][j] == -1) continue;

                let tile = this.tile_at(i, j)
                let down_adj_tile = this.get_down_adj_tile(tile, board_mat);

                if (down_adj_tile == null) continue;

                if (down_adj_tile.merge_tile == null && this.can_merge(down_adj_tile, tile)) {
                    tile.merge_tile = down_adj_tile;
                }
            }
        }
    }



    set_tile_dest_positions(swipe_dir) {

        for (let tile of this.tiles) {

            if (swipe_dir == "a") { //left

                let dest_col = this.num_non_merge_tiles_left_of(tile);

                if (tile.merge_tile != null) dest_col--;

                tile.set_target(tile.row, dest_col);

            }
            else if (swipe_dir == "d") { //right

                let dest_col = this.cols - 1 - this.num_non_merge_tiles_right_of(tile);

                if (tile.merge_tile != null) dest_col++;

                tile.set_target(tile.row, dest_col);

            }
            else if (swipe_dir == "w") { //up

                let dest_row = this.num_non_merge_tiles_above(tile);

                if (tile.merge_tile != null) dest_row--;

                tile.set_target(dest_row, tile.col);

            }
            else if (swipe_dir == "s") { //down

                let dest_row = this.rows - 1 - this.num_non_merge_tiles_below(tile);

                if (tile.merge_tile != null) dest_row++;

                tile.set_target(dest_row, tile.col);
            }
        }
    }

    swipe(dir) {

        if (!this.swipe_complete) return;

        let board_mat = this.get_board_matrix_config();

        this.set_adjacent_merge_tiles(board_mat, dir);
        this.set_tile_dest_positions(dir);

        this.swipe_complete = false;
        this.initiate_tile_swipe();
        
    }


    initiate_tile_swipe() {
        for (let tile of this.tiles) {
            tile.start_moving_to_target()
            this.tiles_in_motion.push(tile);
        }
    }

    update_tile_scales() {
        for (let tile of this.tiles) {
            tile.update_scale();
        }
    }

    update_tile_speeds() {
        for (let tile of this.tiles) {
            tile.update_speed();
        }
    }

    /* merges tile_1 into tile_2 */

    merge(tile_1, tile_2) {

        if (tile_1 == null || tile_2 == null) return;

        let i = tile_1.row;
        let j = tile_1.col;
        let val_1 = tile_1.val;
        let val_2 = tile_2.val;
        let new_val = val_1 + val_2;

        this.delete_tile(tile_1);
        this.delete_tile(tile_2); 

        this.add_tile(i, j, new_val, true);
        GLOBAL_SCORE += new_val;

    }

    update_tiles_in_motion() {

        for (let tile of this.tiles_in_motion) {

            tile.update_position();

            if (!tile.moving_to_target) {

                this.tiles_in_motion = this.tiles_in_motion.filter(item => item !== tile);

                if (tile.within_merging_range) this.merge(tile, tile.merge_tile);
            }
        }

        if (this.tiles_in_motion.length == 0) {
            this.finish_swipe();
        } 

    } 

    delete_tile(tile) {
        this.tiles = this.tiles.filter(item => item !== tile);
    }


    update_tiles() {
        this.update_tile_scales();
        this.update_tile_speeds();
        if (this.swipe_complete) return;
        this.update_tiles_in_motion();
    }

    draw() {
        this.renderer.draw();
    }
};