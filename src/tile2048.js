
class Tile2048 {

    constructor(row, col, val, board_renderer) {

        this.row = row;
        this.col = col;
        this.val = val;
        this.board_renderer = board_renderer;

        this.target_row = row;
        this.target_col = col;

        this.x = this.get_board_pos_x(col);
        this.y = this.get_board_pos_y(row);

        this.target_x = this.get_board_pos_x(col);
        this.target_y = this.get_board_pos_y(row);

        this.moving_to_target = false;
        this.snap_threshold = 1;
        this.deccel_threshold = 150;
        
        this.vel_x = 0;
        this.vel_y = 0;
        this.accel = 0;
    
        this.max_speed = 100;
        this.initial_speed = 0;
        
    
    }

    set_initial_vel() {
        if (this.target_col == this.col) {
            let dir = (this.row < this.target_row) ? 1 : -1;
            this.vel_y = this.initial_speed * dir;
        }
        else if (this.target_row == this.row) {
            let dir = (this.col < this.target_col) ? 1 : -1;
            this.vel_x = this.initial_speed * dir;
        }
    }

    set_adaptive_accel() {
        if (this.target_col == this.col) {
            this.accel = (this.target_row - this.row) * 2;
        }
        else if (this.target_row == this.row) {
            this.accel = (this.target_col - this.col) * 2;
        }
        
    }

    get_speed() {
        if (this.target_row == this.row) {
            return Math.abs(this.vel_x);
        }
        else if (this.target_col == this.col) {
            return Math.abs(this.vel_y);
        }
    }

    set_target_row(row) {
        this.target_row = row;
        this.target_y = this.get_board_pos_y(this.target_row);
        this.set_adaptive_accel();
        this.set_initial_vel();
        
    }

    set_target_col(col) {
        this.target_col = col;
        this.target_x = this.get_board_pos_x(col);
        this.set_adaptive_accel();
        this.set_initial_vel();
    }

    start_moving_to_target() {
        this.moving_to_target = true;
    }

    dist_to_target_x() {    
        return Math.abs(this.target_x - this.x);
    }

    dist_to_target_y() {
        return Math.abs(this.target_y - this.y);
    }

    is_in_range_of_target() {
        return this.dist_to_target_x() < this.snap_threshold &&
               this.dist_to_target_y() < this.snap_threshold;
    }

    move_to_target() {
        if (this.target_row == this.row) {
            if (this.get_speed() < this.max_speed) {
                this.vel_x += this.accel;    
            }
            this.x += this.vel_x;
        }
        else if (this.target_col == this.col) {
            if (this.get_speed() < this.max_speed) {
                this.vel_y += this.accel;
            }
            this.y += this.vel_y;
        }
    }

    snap_to_target() {

        this.x = this.target_x;
        this.y = this.target_y;

        this.accel = 0;
        this.vel_x = 0;
        this.vel_y = 0;

        this.row = this.target_row;
        this.col = this.target_col;
        this.moving_to_target = false;
    }

    get_board_pos_x(col) {
        return this.board_renderer.board_upper_left_x() + TILE_MARGIN
            + (TILE_SIZE + TILE_MARGIN) * col;
    }

    get_board_pos_y(row) {
        return this.board_renderer.board_upper_left_y() + TILE_MARGIN
            + (TILE_SIZE + TILE_MARGIN) * row;
    }

    draw_tile_body() {
        ctx.fillStyle = TILE_COLOR;
        rounded_rect(this.x, this.y, TILE_SIZE, TILE_SIZE, TILE_ROUNDING);
        ctx.fill();
    }   

    get_tile_font_size() {
        return 50 - (this.val.toString().length) * 4;
    }

    draw_tile_number() {
        ctx.font = this.get_tile_font_size().toString() + "px serif";
        ctx.fillStyle = TILE_TEXT_COLOR;
        ctx.fillText(this.val.toString(), this.x + TILE_SIZE/2, this.y + TILE_SIZE/2); 
    }

    draw() {
        this.draw_tile_body();
        this.draw_tile_number();
    }

    update_position() {

        if (!this.moving_to_target) return;

        last_active_tick = tick; //global

        if (this.is_in_range_of_target()) {
            this.snap_to_target();
        }
        else {
            this.move_to_target();
            this.snap_threshold = this.get_speed() * 0.75;
        }
        
    }
}