/**
 * Created by YIM610 on 2018/5/15.
 *
 */
function init() {
    let game = new Game();
    Game.start();
}

let ImageRepository = new function() {
    this.bkImage = new Image();
    this.plImage = new Image();
    this.obImage = new Image();
    this.tgImage = new Image();

    this.bkImage.src = "img/background.png";
    this.plImage.src = "img/people.png";
    this.obImage.src = "img/obstancle.png";
    this.tgImage.src = "img/target.png";

    let imgNum = 4;
    let imgLoaded = 0;

    let handleLoad = function() {
        imgLoaded++;
        if(imgLoaded === imgNum) {
            init();
        }
    };

    this.bkImage.onload = function() {
        handleLoad();
    };
    this.tgImage.onload = function() {
        handleLoad();
    };
    this.obImage.onload = function() {
        handleLoad();
    };
    this.plImage.onload = function() {
        handleLoad();
    };
};

class Drawable {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    init(ele) {
        if(ele.getContext) {
            this.ctx = ele.getContext("2d");
        }
    }
}

class Background extends Drawable {
    constructor(ele) {
        super(0, 0, MAP.width, MAP.height);
        super.init(ele);
    }

    __initMAP() {
        //MAP.arr地图矩阵，0代表可通过，1代表障碍物
        for(let i = 0; i < MAP.rows; i++) {
            MAP.arr.push([]);
            for(let j = 0; j < MAP.cols; j++) {
                MAP.arr[i][j] = 0;
            }
        }
    }

    __initWay(startX, startY, endX, endY) {
        let x = startX || 0,
            y = startY || 0;
        var endX = endX || MAP.rows,
            endY = endY || MAP.cols;

        while(x !== endX || y !== endY) {
            MAP.arr[x][y] = 1;
            if(Math.random() > 0.5) {
                if(Math.random() > 0.5 && x < MAP.rows - 1) {
                    x++;
                } else if(x > 0){
                    x--;
                }
            } else {
                if(Math.random() > 0.5 && y < MAP.cols - 1) {
                    y++;
                }else if(y > 0) {
                    y--;
                }
            }
        }
    }

    draw() {
        this.__initMAP();
        this.__initWay();

        for(let i = 0; i < MAP.rows; i++) {
            for(let j = 0; j < MAP.cols; j++) {
                if(MAP.arr[i][j] === 0) {
                    this.ctx.drawImage(ImageRepository.bkImage, i * this.width, j * this.height, this.width, this.height);
                } else{
                    this.ctx.drawImage(ImageRepository.obImage, i * this.width, j * this.height, this.width, this.height);
                }
            }
        }
    }
}

class Game {
    constructor() {
        this.bgEle = document.getElementById("background");
        this.plEle = document.getElementById("people");
        this.bg = new Background(this.bgEle);
        //this.pl = new People(this.plEle);
        this.init();
    }

    init() {
        this.bg.draw();
    }

    start() {

    }

    restart() {

    }
}