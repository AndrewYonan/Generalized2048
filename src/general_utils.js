

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

function left_shift(arr) {
    for (let start_idx = 0; start_idx < arr.length; ++start_idx) {

        let j = start_idx;
        let rightmost_non_zero;

        while (j < arr.length - 1 && arr[j] == 0) j++;
        rightmost_non_zero = arr[j];

        if (j == start_idx) continue;

        arr[j] = 0;
        while (arr[j] == 0 && j >= 0) j--;
        arr[j+1] = rightmost_non_zero;   
    }
}


function right_shift(arr) {
    for (let start_idx = arr.length - 1; start_idx >= 0; --start_idx) {

        let j = start_idx;
        let leftmost_non_zero;

        while (j > 0 && arr[j] == 0) j--;
        leftmost_non_zero = arr[j];

        if (j == start_idx) continue;

        arr[j] = 0;
        while (arr[j] == 0 && j <= arr.length - 1) j++;
        arr[j-1] = leftmost_non_zero;   
    }
}