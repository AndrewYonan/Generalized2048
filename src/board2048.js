
/* NOTES : set_left_adjacent_merge_tiles() implements a left-hand merge policy,
    where matching tiles merge in pairs starting from the left.
    Hence the correctness of the following method depends
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

    }

    take_game_turn(swipe_dir) {
        this.swipe(swipe_dir);
    }

    finish_swipe() {
        this.swipe_complete = true;
        this.add_random_tile();
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
        this.add_tile(rand_pos[0], rand_pos[1], rand_rank);
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

    /* returns the number of non-merge tiles (tiles whose merge_tile field is null) 
    to the left of <tile>*/

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

                /* only set left_adj_tile as the merge tile of "tile" 
                if adj isn't already merging into another tile */

                if (left_adj_tile.merge_tile == null && left_adj_tile.val == tile.val) {
                    tile.merge_tile = left_adj_tile;
                }
            }
        }
    }   

    /* the following method, in symmetry with the last
    must traverse the columns from right to left */

    set_right_adjacent_merge_tiles(board_mat) {
        
        for (let i = 0; i < this.rows; ++i) {
            for (let j = this.cols - 1; j >= 0; --j) {
                
                if (board_mat[i][j] == -1) continue;

                let tile = this.tile_at(i, j)
                let right_adj_tile = this.get_right_adj_tile(tile, board_mat);

                if (right_adj_tile == null) continue;

                if (right_adj_tile.merge_tile == null && right_adj_tile.val == tile.val) {
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

                if (up_adj_tile.merge_tile == null && up_adj_tile.val == tile.val) {
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

                if (down_adj_tile.merge_tile == null && down_adj_tile.val == tile.val) {
                    tile.merge_tile = down_adj_tile;
                }
            }
        }
    }



    set_tile_dest_positions(board_mat, swipe_dir) {

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

    update_tile_scales() {
        for (let tile of this.tiles) {
            tile.update_scale();
        }
    }

    update_tiles_in_motion() {

        for (let tile of this.tiles_in_motion) {

            tile.update_position();

            if (!tile.moving_to_target) {

                this.tiles_in_motion = this.tiles_in_motion.filter(item => item !== tile);

                if (tile.merged) {

                    let i = tile.row;
                    let j = tile.col;
                    let val = tile.val;

                    this.delete_tile(tile.merge_tile);
                    this.delete_tile(tile); 

                    this.add_tile(i, j, val*2, true);
                } 
                
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
        if (this.swipe_complete) return;
        this.update_tiles_in_motion();
        
    }

    draw() {
        this.renderer.draw();
    }
};