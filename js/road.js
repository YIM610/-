/**
 * Created by YIM610 on 2018/5/29.
 *
 */


class Node {
    constructor(x, y, g) {
        this.x = x;
        this.y = y;
        this.parent = null;
        this.child = [];

        if(g) {
            this.g = g;
        } else {
            this.g = 0;
        }
        this.f = 0;
    }

    setF(x, y) {
        let xCross = x - this.x;
        let yCross = y - this.y;

        this.f = Math.sqrt(xCross * xCross + yCross * yCross) + this.g;
    }
}

class RoadFinder {
    constructor(pl, target) {
        this.pl = pl;
        this.root = new Node(pl.x, pl.y, true);
        this.target = target;
    }

    __setChild(node) {
        let avail = function(num, isX) {
            if (isX && num > 0 && num< MAP.rows) {
                return true;
            }
            if(!isX && num > 0 && num< MAP.cols) {
                return true;
            }
        };

        if(avail(node.y + 1, false)) {
            node.child.push(new Node(node.x, node.y + 1, node.g + 10));
        }
        if(avail(node.y - 1, false)) {
            node.child.push(new Node(node.x, node.y - 1, node.g + 10));
        }
        if(avail(node.x - 1, true)) {
            node.child.push(new Node(node.x - 1, node.y, node.g + 10));
            if(avail(node.y - 1, false)) {
                node.child.push(new Node(node.x - 1, node.y - 1, node.g + 14));
            }
            if(avail(node.y + 1, false)) {
                node.child.push(new Node(node.x - 1, node.y + 1, node.g + 14));
            }
        }
        if(avail(node.x + 1, true)) {
            node.child.push(new Node(node.x + 1, node.y, node.g + 10));
            if(avail(node.y - 1, false)) {
                node.child.push(new Node(node.x + 1, node.y - 1, node.g + 14));
            }
            if(avail(node.y + 1, false)) {
                node.child.push(new Node(node.x + 1, node.y + 1, node.g + 14));
            }
        }
    }

    __isAvail(node) {
        if(MAP.arr[node.x][node.y] !== 1) {
            return true;
        }
        return false;
    }

    __findRoad(fromX, fromY, toX, toY) {
        let closeSet = [];
        let openSet = [new Node(fromX, fromY)];
        let n = null;

        let itemInSet = function(item, set) {
            let len = set.length;
            for(let i = 0; i < len; i++) {
                if(set[i].x === item.x && set[i].y === item.y) {
                    return true;
                }
            }
            return false;
        };

        do {
            n = openSet.pop();
            closeSet.push(n);

            this.__setChild(n);
            for(let i in n.child) {
                let item = n.child[i];
                if(this.__isAvail(item) && !itemInSet(item, closeSet)) {
                    if (itemInSet(item, openSet)) {
                        let newG;
                        if (item.x - n.x && item.y - n.y) {
                            newG = n.g + COST.ob;
                        } else {
                            newG = n.g + COST.hor;
                        }
                        if (newG < item.g) {
                            item.g = newG;
                            item.parent = n;
                        }
                        item.setF(toX, toY);
                    } else {
                        openSet.push(item);
                        item.setF(toX, toY);
                        item.parent = n;
                    }
                }
            }

            if(openSet.length === 0) {
                console.log("不可达");
                return;
            }

            openSet.sort(function(a, b) {
                return b.f - a.f;
            });
        }while(!(n.x === toX && n.y === toY));

        let result = [];
        console.log("sss" ,n);
        while(!(n.x === fromX && n.y === fromY)) {
            result.unshift([n.x, n.y]);
            n = n.parent;
        }
        console.log(result);
        return result;
    }

    animation(x = this.target.randomX, y = this.target.randomY) {
        let result = this.__findRoad(this.pl.x, this.pl.y, x, y);
        if(!result) {
            return;
        }
        let p = Promise.resolve();
        let self = this;
        let len = result.length;
        for(let i = 0; i < len; i++) {
            p = p.then(function() {

                let next = result.shift();

                let xCross = self.pl.x - next[0];
                let yCross = self.pl.y - next[1];

                return new Promise(function(resolve, reject) {
                    let timer = setInterval(function() {
                        if(xCross || yCross) {
                            if (xCross === 1) {
                                if(self.pl.posX !== next[0] * MAP.cell_width + 2) {
                                    self.pl.posX--;
                                }
                            } else if (xCross === -1) {
                                if(self.pl.posX !== next[0] * MAP.cell_width + 2) {
                                    self.pl.posX++;
                                }
                            }
                            if (yCross === 1) {
                                if(self.pl.posY !== next[1] * MAP.height + 2) {
                                    self.pl.posY--;
                                }
                            } else if (yCross === -1) {
                                if(self.pl.posY !== next[1] * MAP.cell_height + 2) {
                                    self.pl.posY++;
                                }
                            }

                            if (self.pl.posX === next[0] * MAP.cell_width + 2 && self.pl.posY === next[1] * MAP.cell_height + 2) {
                                clearInterval(timer);
                                self.pl.x = next[0];
                                self.pl.y = next[1];
                                resolve();
                            }
                        }
                    }, 10);
                });
            });
        }
        p.catch(function(message){
            console.log(message);
        });
    }

    setPos(x, y) {
        this.animation(x, y);
    }

}