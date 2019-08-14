//file SongZ.js
/////////////////////////////////////////////////
var song;
if (!song) song = {};
if (!song.ani) song.ani = {};

/////////////////////////////////////////////////

song.ani.SongZ = function () { //implements ISongVimo
    var that;
    function SongZ(canvas, params) {
        this.spriteWidth = 1;
        this.spriteWidth2 = Math.floor(this.spriteWidth / 2);
        this.spriteHeight = 1;
        this.spriteHeight2 = Math.floor(this.spriteHeight / 2);

        this.color = "green";
        this.markColor = "red";

        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShowLine = false;

        this.viewport = {
            x: 0,
            y: 0,
            width: 551,
            height: 401
        };

        this.digits = [];
        for (var i = 0; i < 10; i++) {
            this.digits[i] = new Image();
            this.digits[i].src = "images/2d/" + i + ".gif";
        }

        this.spriteImage = new Image();
        this.spriteImage.src = "images/3d/sprite.gif";

        this.ordinateImage = new Image();
        this.ordinateImage.src = "images/3d/ordinatez.gif";
        this.noordinateImage = new Image();
        this.noordinateImage.src = "images/3d/noordinate.gif";
        this.backImage = this.noordinateImage;
        
        this.srcImage = new Image();
        this.srcImage.src = "images/3d/src.gif";

        this.markImage = new Image();
        this.markImage.src = "images/3d/mark.gif";

        this.offImage = document.createElement('canvas');
        this.offImage.width = this.viewport.width;
        this.offImage.height = this.viewport.height;
        this.offGraphics = this.offImage.getContext("2d");

        this.canvas = canvas;
        this.canvas.onclick = this.click;
        this.onGraphics = this.canvas.getContext("2d");

        that = this;
        this.backImage.onload = function () { that.update() }
        
        this.init(params);
    }


    SongZ.prototype.init = function (params) {
        this.A = params.A;
        this.T = params.T;
        this.V = params.V;
        this.Fi = params.Fi;
        this.xn = params.xn;
        this.yn = params.xn;
        this.zn = params.xn;

        this.density = params.density;
        this.maxX = params.maxX;
        this.maxZ = params.maxZ;
        this.maxY = params.maxY;
        this.dv = params.dv;
        this.dv2 = Math.floor(this.dv / 2);
        this.centerX = params.centerX;
        this.centerY = params.centerY;
        this.clockCenterX = params.clockCenterX;
        this.clockCenterY = params.clockCenterY;
        this.digitWidth = params.digitWidth;
        this.space = params.space;
        this.snap = params.snap;
        this.dimension = params.dimension;
        this.isWater = params.isWater;

        var buf = [];
        for (var i = 0; i < song.Const.solution; i++)
            buf[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));

        var sprites = [];
        var startTime, startPoint, orient;
        var d;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            sprites[x] = [];
            for (var z = -this.maxZ; z <= this.maxZ; z++) {
                sprites[x][z] = [];
                for (var y = -this.maxY; y <= this.maxY; y++) {
                    if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                        d = (this.dimension==1)?Math.abs(x - this.xn):Math.sqrt((x - this.xn) * (x - this.xn) + (z - this.zn) * (z - this.zn) + (y - this.yn) * (y - this.yn));
                        startTime = d * song.Const.fps / this.V;
                        startPosition = {
                            x: x * this.dv + z * this.dv2 + this.centerX,
                            y: y * this.dv + z * this.dv2 + this.centerY
                        }
                        orient = this.isWater ? { x: 0, y: -1} : (this.dimension==1)?{x:1,y:0}: ((d == 0) ? { x: 0, y: 0} :
                        {
                            x: (x - this.xn + (z - this.zn) / 2) / d,
                            y: (y - this.yn + (z - this.zn) / 2) / d
                        });

                        sprites[x][z][y] = song.Const.newSprite(this.spriteImage, this.spriteWidth, this.spriteHeight, startPosition, orient, startTime);
                    }
                }
            }
        }
        sprites[this.xn][this.zn][this.yn].image = this.srcImage;
        var step = song.Const.solution / (this.T * song.Const.fps);
        this.spriteManager = new song.sprite.SpriteZManager(sprites, this.backImage, buf, step, this.space);
    }

    SongZ.prototype.reset = function () {
        this.spriteManager.reset();
        this.update();
    }

    SongZ.prototype.run = function () {
        this.spriteManager.update();
        this.update();
        this.spriteManager.time++;

        return (this.spriteManager.time <= this.snap);
    }

    SongZ.prototype.update = function () {
        if (!this.isShowLine) {
            this.spriteManager.draw(this.offGraphics);
        } else {
            this.offGraphics.drawImage(this.spriteManager.backImage, 0, 0);

            //ve line ko mark
            this.offGraphics.beginPath();
            this.offGraphics.strokeStyle = this.color;
            for (var x = -this.maxX; x <= this.maxX; x++)
                for (var y = -this.maxY; y <= this.maxY; y++)
                    for (var z = -this.maxZ; z <= this.maxZ; z++)
                        if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                            if (x != this.xMark && y != this.yMark) {
                                s = this.spriteManager.sprites[x][z][y];
                                if (z != -this.maxZ && x % this.space == 0 && y % this.space == 0)
                                    this.offGraphics.lineTo(s.position.x, s.position.y);
                                else if (z % this.space == 0)
                                    this.offGraphics.moveTo(s.position.x, s.position.y);
                            }
                        }
            for (var x = -this.maxZ; x <= this.maxZ; x++)
                for (var y = -this.maxX; y <= this.maxX; y++)
                    for (var z = -this.maxY; z <= this.maxY; z++)
                        if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                            if (y != this.xMark && x != this.zMark) {
                                s = this.spriteManager.sprites[y][x][z];
                                if (z != -this.maxY && x % this.space == 0 && y % this.space == 0)
                                    this.offGraphics.lineTo(s.position.x, s.position.y);
                                else if (z % this.space == 0)
                                    this.offGraphics.moveTo(s.position.x, s.position.y);
                            }
                        }
            for (var x = -this.maxY; x <= this.maxY; x++)
                for (var y = -this.maxZ; y <= this.maxZ; y++)
                    for (var z = -this.maxX; z <= this.maxX; z++)
                        if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                            if (y != this.zMark && x != this.yMark) {
                                s = this.spriteManager.sprites[z][y][x];
                                if (z != -this.maxX && x % this.space == 0 && y % this.space == 0)
                                    this.offGraphics.lineTo(s.position.x, s.position.y);
                                else if (z % this.space == 0)
                                    this.offGraphics.moveTo(s.position.x, s.position.y);
                            }
                        }
            this.offGraphics.stroke();
            //ve line mark
            this.offGraphics.beginPath();
            this.offGraphics.strokeStyle = this.markColor;
            for (var x = -this.maxX; x <= this.maxX; x++)
                for (var y = -this.maxY; y <= this.maxY; y++)
                    for (var z = -this.maxZ; z <= this.maxZ; z++)
                        if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                            if (x == this.xMark || y == this.yMark) {
                                s = this.spriteManager.sprites[x][z][y];
                                if (z != -this.maxZ && x % this.space == 0 && y % this.space == 0)
                                    this.offGraphics.lineTo(s.position.x, s.position.y);
                                else if (z % this.space == 0)
                                    this.offGraphics.moveTo(s.position.x, s.position.y);
                            }
                        }
            for (var x = -this.maxZ; x <= this.maxZ; x++)
                for (var y = -this.maxX; y <= this.maxX; y++)
                    for (var z = -this.maxY; z <= this.maxY; z++)
                        if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                            if (y == this.xMark || x == this.zMark) {
                                s = this.spriteManager.sprites[y][x][z];
                                if (z != -this.maxY && x % this.space == 0 && y % this.space == 0)
                                    this.offGraphics.lineTo(s.position.x, s.position.y);
                                else if (z % this.space == 0)
                                    this.offGraphics.moveTo(s.position.x, s.position.y);
                            }
                        }
            for (var x = -this.maxY; x <= this.maxY; x++)
                for (var y = -this.maxZ; y <= this.maxZ; y++)
                    for (var z = -this.maxX; z <= this.maxX; z++)
                        if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                            if (y == this.zMark || x == this.yMark) {
                                s = this.spriteManager.sprites[z][y][x];
                                if (z != -this.maxX && x % this.space == 0 && y % this.space == 0)
                                    this.offGraphics.lineTo(s.position.x, s.position.y);
                                else if (z % this.space == 0)
                                    this.offGraphics.moveTo(s.position.x, s.position.y);
                            }
                        }
            this.offGraphics.stroke();
            var sn = this.spriteManager.sprites[this.xn][this.zn][this.yn];
            this.offGraphics.drawImage(this.srcImage,sn.position.x - 1, sn.position.y - 1);        
        }

        var d0 = Math.round(this.spriteManager.time * 10 / song.Const.fps) % 10;
        var d1 = Math.round(this.spriteManager.time / song.Const.fps) % 10;
        var d2 = Math.round(this.spriteManager.time / (10 * song.Const.fps)) % 10;
        var d3 = Math.round(this.spriteManager.time / (100 * song.Const.fps)) % 10;
        this.offGraphics.drawImage(this.digits[d3], this.clockCenterX, this.clockCenterY);
        this.offGraphics.drawImage(this.digits[d2], this.clockCenterX + this.digitWidth, this.clockCenterY);
        this.offGraphics.drawImage(this.digits[d1], this.clockCenterX + 2 * this.digitWidth, this.clockCenterY);
        this.offGraphics.drawImage(this.digits[d0], this.clockCenterX + 3 * this.digitWidth, this.clockCenterY);

        this.onGraphics.drawImage(this.offImage, this.viewport.x, this.viewport.y);
    }

    SongZ.prototype.getA = function () {
        return this.A;
    }
    SongZ.prototype.getT = function () {
        return this.T;
    }
    SongZ.prototype.getV = function () {
        return this.V;
    }
    SongZ.prototype.getFi = function () {
        return this.Fi;
    }

    SongZ.prototype.setFi = function (fi) {
        this.Fi = fi;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
    }
    SongZ.prototype.setA = function (a) {
        this.A = a;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
    }
    SongZ.prototype.setT = function (t) {
        this.T = t;
        this.spriteManager.step = song.Const.solution / (this.T * song.Const.fps);
    }
    SongZ.prototype.setV = function (v) {
        this.V = v;
        var x = 0;
        for (var i = 0; i < this.maxX; i++) {
            x = i - this.maxX2;
            this.spriteManager.sprites[i].startTime = this.density * Math.abs(x - this.xn) * song.Const.fps / this.V;
        }
    }

    SongZ.prototype.setSrc = function (xs, zs, ys) {
        var x = 0;
        for (var i = 0; i < this.maxX; i++) {
            x = i - this.maxX2;
            this.spriteManager.sprites[i].startTime = this.density * Math.abs(x - xs) * song.Const.fps / this.V;
            if (x == this.xn)
                this.spriteManager.sprites[i].image = this.spriteImage;
            if (x == xs)
                this.spriteManager.sprites[i].image = this.srcImage;
        }
        this.xn = xs;
        this.update();
    }

    SongZ.prototype.getSrc = function () {
        return this.xn;
    }

    SongZ.prototype.setDensity = function (d) {
        this.density = d;
        var x = 0;
        for (var i = 0; i < this.maxX; i++) {
            x = i - this.maxX2;
            this.spriteManager.sprites[i].startPosition = {
                x: Math.round(this.density * x * this.dv) + this.centerX,
                y: this.centerY
            };
            this.spriteManager.sprites[i].startTime = this.density * Math.abs(x - this.xn) * song.Const.fps / this.V;
        }
        this.spriteManager.reset();
        this.update();
    }

    SongZ.prototype.getDensity = function () {
        return this.density;
    }

    SongZ.prototype.mark = function (img, xm, zm, ym) {
        for (var x = -this.maxX; x <= this.maxX; x++) {
            for (var z = -this.maxZ; z <= this.maxZ; z++) {
                for (var y = -this.maxY; y <= this.maxY; y++) {
                    if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                        if ((x == xm || z == zm || y == ym) && !(x == this.xn && z == this.zn && y == this.yn))
                            this.spriteManager.sprites[x][z][y].image = img;
                    }
                }
            }
        }
    }

    SongZ.prototype.show = function (flag, val) {
        switch (flag) {
            case 1: this.xMark = val; this.mark(this.markImage, this.xMark); break;
            case -1: this.mark(this.spriteImage, this.xMark); this.xMark = null; break;
            case 2: this.zMark = val; this.mark(this.markImage, null, this.zMark); break;
            case -2: this.mark(this.spriteImage, null, this.zMark); this.zMark = null; break;
            case 3: this.yMark = val; this.mark(this.markImage, null, null, this.yMark); break;
            case -3: this.mark(this.spriteImage, null, null, this.yMark); this.yMark = null; break;

            case 4: this.isShowLine = true; break;
            case -4: this.isShowLine = false; break;
            case 5: this.spriteManager.backImage = this.ordinateImage; break;
            case -5: this.spriteManager.backImage = this.noordinateImage; break;
        }
        this.update();
    }

    SongZ.prototype.setSnap = function (t) {
        this.snap = t * song.Const.fps;
    }

    SongZ.prototype.getSnap = function () {
        return this.snap / song.Const.fps;
    }

    SongZ.prototype.getOrient = function () {
        return this.orient;
    }

    SongZ.prototype.setOrient = function (orient) {
        this.orient = orient;
        var s;
        for (var i = 0; i < this.spriteManager.sprites.length; i++) {
            s = this.spriteManager.sprites[i];
            s.orientVectorX = this.orient.x;
            s.orientVectorY = this.orient.y;
        }
    }

    return SongZ;
} ();                                                                           //end class SongZ
/////////////////////////////////////////////////