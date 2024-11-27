
class Tile2048 {

    constructor(row, col, val, board_renderer) {

        this.row = row;
        this.col = col;
        this.val = val;
        this.board_renderer = board_renderer;

        this.target_row = row;
        this.target_col = col;

        this.pos = this.get_board_pos(row, col);
        this.target_pos = this.get_board_pos(row, col);
        this.unit_dir_to_target;
        this.moving_to_target = false;
        this.snap_threshold = 10;

        this.bloom_animation = true;
        this.initial_bloom_size = 10;
        this.bloom_threshold = 1;
        this.bloom_speed = 15;

        this.scale = TILE_SIZE;
        this.vel = {x : 0, y : 0};
        this.accel = {x : 0, y : 0};
        this.scale = {x : this.initial_bloom_size, y : this.initial_bloom_size};
        
        this.max_speed = 75;
        this.max_accel = 5;
        this.initial_speed = 5;
        this.merging = false;
    }

    animate_bloom() {
        if (this.scale.x >= TILE_SIZE - this.bloom_threshold && this.scale.y >= TILE_SIZE - this.bloom_threshold) {
            this.bloom_animation = false;
            this.scale.x = TILE_SIZE;
            this.scale.y = TILE_SIZE;
        }
        else {
            this.scale.x += (this.bloom_speed) * (1 - this.scale.x / (TILE_SIZE));
            this.scale.y += (this.bloom_speed) * (1 - this.scale.y / (TILE_SIZE));
        }
        
    }

    set_initial_vel() {
        let dir = this.unit_dir_to_target;
        this.vel = {x : this.initial_speed * dir.x, 
                    y : this.initial_speed * dir.y};
    }

    set_adaptive_accel() {
        let dir = this.get_displace_to_target();
        this.accel = {x : dir.x * this.max_accel / 300,
                      y : dir.y * this.max_accel / 300};
    }

    get_speed_squared() {
        return this.vel.x * this.vel.x + this.vel.y * this.vel.y;
    }

    set_target(row, col) {
        this.target_row = row;
        this.target_col = col;
        this.target_pos = this.get_board_pos(row, col);
        this.unit_dir_to_target = this.get_unit_dir_to_target();
        this.set_adaptive_accel();
        this.set_initial_vel();
    }


    start_moving_to_target() {
        this.moving_to_target = true;
    }

    dist_to_target() {    
        return Math.abs(this.target_pos.x - this.pos.x) + Math.abs(this.target_pos.y - this.pos.y);
    }

    is_in_range_of_target() {
        return this.dist_to_target() < this.snap_threshold;
    }

    get_unit_dir_to_target() {
        let dir = {x : this.target_pos.x - this.pos.x, y : this.target_pos.y - this.pos.y};
        let mag = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
        if (mag == 0) return {x : 0, y : 0};
        return {x : dir.x / mag, y : dir.y / mag};
    }

    get_displace_to_target() {
        return {x : this.target_pos.x - this.pos.x, 
                y : this.target_pos.y - this.pos.y};
    }

    move_to_target() {         
        if (this.get_speed_squared() < this.max_speed * this.max_speed) {
            this.vel.x += this.accel.x;
            this.vel.y += this.accel.y;
        }
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    snap_to_target() {
        this.pos = this.target_pos;
        this.accel = {x : 0, y : 0};
        this.vel = {x : 0, y : 0};
        this.row = this.target_row;
        this.col = this.target_col;
        this.moving_to_target = false;
    }

    get_board_pos(row, col) {
        return {x : this.board_renderer.board_upper_left_x() + TILE_MARGIN
                        + (TILE_SIZE + TILE_MARGIN) * col, 
                y : this.board_renderer.board_upper_left_y() + TILE_MARGIN
                        + (TILE_SIZE + TILE_MARGIN) * row};
    }

    get_tile_font_size() {
        return this.scale.x/2 - (this.val.toString().length) * 4;
    }

    draw_tile_body() {
        ctx.fillStyle = TILE_COLOR;
        rounded_rect(this.pos.x + TILE_SIZE/2 - this.scale.x/2, 
                    this.pos.y + TILE_SIZE/2 - this.scale.y/2, 
                    this.scale.x, 
                    this.scale.y, 
                    TILE_ROUNDING);
        ctx.fill();
    }   

    draw_tile_number() {
        ctx.font = this.get_tile_font_size().toString() + "px serif";
        ctx.fillStyle = TILE_TEXT_COLOR;
        ctx.fillText(this.val.toString(), this.pos.x + TILE_SIZE/2, this.pos.y + TILE_SIZE/2); 
    }

    draw() {
        this.draw_tile_body();
        this.draw_tile_number();
    }

    update_scale() {
        if (this.bloom_animation) this.animate_bloom();
    }

    update_position() {

        if (!this.moving_to_target) return;

        last_active_tick = tick; //global

        if (this.is_in_range_of_target()) {
            this.snap_to_target();
        }
        else {
            this.move_to_target();
            this.snap_threshold = Math.sqrt(this.get_speed_squared());
        }
    }
}