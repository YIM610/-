/**
 * Created by YIM610 on 2018/5/13.
 *
 */

let pl = null;
let tg = null;
let game = null;
let requstAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let CANVAS_WIDTH = document.body.offsetWidth,
    CANVAS_HEIGHT = document.body.offsetHeight,
    KEY_CODES = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    },
    KEY_STATUS = {
        "left" :false,
        "up": false,
        "right": false,
        "down": false
    },
    COST = {
        hor: 10,
        ob: 14
    },
    MAP = {
        arr: [],                       //地图矩阵
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        cell_width: 34,
        cell_height:34,
        rows: parseInt(CANVAS_WIDTH / 34) + 1,
        cols: parseInt(CANVAS_HEIGHT / 34) + 1
    };