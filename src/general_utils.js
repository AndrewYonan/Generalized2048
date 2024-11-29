

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function min(a, b) {
    return (a < b) ? a : b;
}

function quadratic_hump(r) {
    if (r < 0 || r > 1) return 0;
    return r * (1 - r);
}