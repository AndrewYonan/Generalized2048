const BG_MAIN_COLOR = "#efefdf"
const BOARD_COLOR = "#e4d8b4";
const EMPTY_TILE_SLOT_COLOR = "#c4b894";
const TILE_COLOR = "#c44";
const TILE_TEXT_COLOR = "#fff";
const TILE_SIZE = 100;
const TILE_MARGIN = 5;
const TILE_ROUNDING = 10;
const a = 10; // utils
const b = 1; // utils


function clear_canvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function show_canvas_center() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.rect(W/2 - a, H/2 - b, 2*a, 2*b);
    ctx.rect(W/2 - b, H/2 - a, 2*b, 2*a);
    ctx.fill();
}

function rounded_rect(x, y, width, height, border_radius) {
    if (border_radius > 0) {
        ctx.beginPath();
        ctx.moveTo(x + border_radius, y);
        ctx.lineTo(x + width - border_radius, y); 
        ctx.quadraticCurveTo(x + width, y, x + width, y + border_radius); 
        ctx.lineTo(x + width, y + height - border_radius); 
        ctx.quadraticCurveTo(x + width, y + height, x + width - border_radius, y + height);
        ctx.lineTo(x + border_radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - border_radius);
        ctx.lineTo(x, y + border_radius); 
        ctx.quadraticCurveTo(x, y, x + border_radius, y);
        ctx.closePath();
    } 
    else {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.closePath();
    }
}