/**
 * Created by YIM610 on 2018/5/15.
 *
 */


function init() {
    game = new Game();
    game.start();

    document.addEventListener("click", function(e) {
        let x = parseInt(e.clientX / MAP.cell_width);
        let y = parseInt(e.clientY / MAP.cell_height);

        game.finder.setPos(x, y);
    });
}

function animLoop() {
    pl.go();
    if(pl.x !== tg.randomX || pl.y !== tg.randomY) {
        requstAnimationFrame(this.animLoop);
    } else {
        game.restart();
    }
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
        ele.width = CANVAS_WIDTH;
        ele.height = CANVAS_HEIGHT;
        if(ele.getContext) {
            this.ctx = ele.getContext("2d");
        }
    }
}

class People extends Drawable {
    constructor(ele) {
        super(0, 0, 30, 30);
        super.init(ele);
        this.ele = ele;
        this.target = null;
        this.posX = this.x * MAP.cell_width + 2;
        this.posY = this.y * MAP.cell_height + 2;
    }

    draw(_ctx) {
        this.ctx.drawImage(ImageRepository.tgImage, this.target.randomX * MAP.cell_width + 2, this.target.randomY * MAP.cell_height + 2, 30, 30);
        if(_ctx) {
            _ctx.drawImage(this.ele, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        this.ctx.drawImage(ImageRepository.plImage, this.posX, this.posY, 30, 30);
    }

    go(angel) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.ctx.translate(this.posX + 15, this.posY + 15);
        if(angel) {
            this.ctx.rotate(angel * Math.PI / 180);
        }
        this.ctx.drawImage(ImageRepository.plImage, -15, -15, 30, 30);
        this.ctx.restore();
        console.log("gogog");
    }
}

class Background extends Drawable {
    constructor(ele) {
        super(0, 0, MAP.cell_width, MAP.cell_height);
        super.init(ele);
        this.target = null;
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

    __initWay(x = 0, y = 0, endX = MAP.rows - 2, endY = MAP.cols - 2) {
        while(x !== endX || y !== endY) {
            try {
                MAP.arr[x][y] = 2;
            } catch(e) {
                console.log(e.message);
            }
            if(y !== endY && Math.random() < 0.1) {
                y++;
            } else {
                if(Math.random() > 0.5 && x > 0) {
                    x--;
                } else if(x < MAP.rows){
                    x++;
                }
            }
        }
    }

    __initObstancle(num) {
        for(let i = 0; i < num; i++) {
            let x = Math.floor(Math.random() * MAP.rows);
            let y = Math.floor(Math.random() * MAP.cols);
            if(MAP.arr[x][y] == 0) {
                MAP.arr[x][y] = 1;
            } else {
                i--;
            }
        }
        MAP.arr[this.target.randomX][this.target.randomY] = 0;
    }

    draw() {
        this.__initMAP();
        this.__initWay(0, 0, this.target.randomX, this.target.randomY);
        this.__initObstancle(MAP.rows * MAP.cols / 2);

        for(let i = 0; i < MAP.rows; i++) {
            for(let j = 0; j < MAP.cols; j++) {
                if(MAP.arr[i][j] === 1) {
                    this.ctx.drawImage(ImageRepository.obImage, this.x + i * this.width, this.y + j * this.height, this.width, this.height);
                } else/* if(MAP.arr[i][j] === 0)*/{
                    this.ctx.drawImage(ImageRepository.bkImage, this.x +  i * this.width, this.y + j * this.height, this.width, this.height);
                }
            }
        }
    }
}

class Target {
    constructor(pl) {
        this.randomX = Math.floor(Math.random() * MAP.rows);
        this.randomY = Math.floor(Math.random() * MAP.cols);
        this.canvas = pl;
        pl.target = this;
    }
}

class Game {
    constructor() {
        this.bgEle = document.getElementById("background");
        this.plEle = document.getElementById("people");
        this.bg = new Background(this.bgEle);
        this.pl = new People(this.plEle);
        this.target = new Target(this.pl);
        this.finder = new RoadFinder(this.pl, this.target);

        this.bg.target = this.target;
    }

    start() {
        this.bg.draw();
        this.pl.draw(this.bg.ctx);
        pl = this.pl;
        tg = this.target;
        animLoop();
    }

    restart() {
        this.pl = new People(this.plEle);
        this.target = new Target(this.pl);
        this.finder = new RoadFinder(this.pl, this.target);

        this.bg.target = this.target;
        this.start();
    }
}