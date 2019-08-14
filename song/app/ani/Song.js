//file Song.js
/////////////////////////////////////////////////
var song;
if(!song)song={};
if(!song.ani)song.ani={};

/////////////////////////////////////////////////

song.ani.Song = function () { //implements ISongVimo
    var that;
    function Song(canvas, params) {
        this.spriteWidth = 7;
        this.spriteWidth2 = Math.floor(this.spriteWidth / 2);
        this.spriteHeight = 7;
        this.spriteHeight2 = Math.floor(this.spriteHeight / 2);

        this.viewport = {
            x: 0,
            y: 0,
            width: 481,
            height: 241
        };

        this.color = "lime";
        this.color1 = "red";
        this.color2 = "blue";

        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShowLine = false;

        this.digits = [];
        for (var i = 0; i < 10; i++) {
            this.digits[i] = new Image();
            this.digits[i].src = "images/2d/" + i + ".gif";
        }

        this.spriteImage = new Image();
        this.spriteImage.src = "images/2d/Green.gif";

        this.backImage = new Image();
        this.backImage.src = "images/2d/TrucToaDo.gif";

        this.srcImage = new Image();
        this.srcImage.src = "images/2d/Yellow.gif";

        this.markImage = new Image();
        this.markImage.src = "images/2d/Red.gif";

        this.offImage = document.createElement('canvas');
        this.offImage.width = this.viewport.width;
        this.offImage.height = this.viewport.height;
        this.offGraphics = this.offImage.getContext("2d");
        this.canvas = canvas;
        this.canvas.onclick = this.click;
        this.onGraphics = this.canvas.getContext("2d");

        this.viewport2 = { x: 0,
            y: 240,
            width: 481,
            height: 161
        };
        this.backImage2 = new Image();
        this.backImage2.src = "images/2d/TrucToaDo2.gif";
        this.markImage2 = new Image();
        this.markImage2.src = "images/2d/Blue.gif";
        this.offImage2 = document.createElement('canvas');
        this.offImage2.width = this.viewport2.width;
        this.offImage2.height = this.viewport2.height;
        this.offGraphics2 = this.offImage2.getContext("2d");
        
        that = this;
        this.backImage.onload = function () { that.update() }

        this.init(params);
    }


    Song.prototype.init = function (params) {
        this.A = params.A;
        this.T = params.T;
        this.V = params.V;
        this.Fi = params.Fi;
        this.xn = params.xn;
        this.density = params.density;
        this.maxX = params.maxX;
        this.dv = params.dv;
        this.dv2 = Math.floor(this.dv / 2);
        this.centerX = params.centerX;
        this.centerY = params.centerY;
        this.centerX2 = params.centerX2;
        this.centerY2 = params.centerY2;
        this.orient = params.orient;
        this.clockCenterX = params.clockCenterX;
        this.clockCenterY = params.clockCenterY;
        this.digitWidth = params.digitWidth;
        this.dCenterX2 = params.dCenterX2;
        this.snap = params.snap;

        var buf = [];
        for (var i = 0; i < song.Const.solution; i++)
            buf[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));

        var sprites = [];
        var startTime, d;
        var startPoint;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            d = this.density * Math.abs(x - this.xn);
            startTime = d * song.Const.fps / this.V;
            startPoint = {
                x: Math.round(this.density * x * this.dv) + this.centerX,
                y: this.centerY
            };
            sprites[x] = new song.Const.newSprite(this.spriteImage, this.spriteWidth, this.spriteHeight, startPoint, this.orient, startTime); 
        }
        sprites[this.xn].image = this.srcImage;

        var step = song.Const.solution / (this.T * song.Const.fps);
        this.spriteManager = new song.sprite.SpriteManager(sprites, this.backImage, buf, step);
    }

    Song.prototype.reset = function () {
        this.spriteManager.reset();
        this.update();
    }

    Song.prototype.run = function () {
        this.spriteManager.update();
        this.update();
        this.spriteManager.time++;

        return (this.spriteManager.time <= this.snap);
    }

    Song.prototype.update = function () {
        if (!this.isShowLine)
            this.spriteManager.draw(this.offGraphics);
        else
            this.offGraphics.drawImage(this.spriteManager.backImage, 0, 0);

        var d0 = Math.round(this.spriteManager.time * 10 / song.Const.fps) % 10;
        var d1 = Math.round(this.spriteManager.time / song.Const.fps) % 10;
        var d2 = Math.round(this.spriteManager.time / (10 * song.Const.fps)) % 10;
        var d3 = Math.round(this.spriteManager.time / (100 * song.Const.fps)) % 10;
        this.offGraphics.drawImage(this.digits[d3], this.clockCenterX, this.clockCenterY);
        this.offGraphics.drawImage(this.digits[d2], this.clockCenterX + this.digitWidth, this.clockCenterY);
        this.offGraphics.drawImage(this.digits[d1], this.clockCenterX + 2 * this.digitWidth, this.clockCenterY);
        this.offGraphics.drawImage(this.digits[d0], this.clockCenterX + 3 * this.digitWidth, this.clockCenterY);

        if (this.viewport2) this.offGraphics2.drawImage(this.backImage2, 0, 0);
        var phi = 0, phi2 = 0;
        if (this.markSprite) {
            phi = this.markSprite.delta;
            var dx = 0, dy = 0;
            if (phi >= 0) {
                dx = Math.round(Math.cos(phi * Math.PI / 180 + this.Fi) * this.A * this.dv);
                dy = -Math.round(Math.sin(phi * Math.PI / 180 + this.Fi) * this.A * this.dv);
            } else phi = 0;
            this.offGraphics.strokeStyle = this.color1;
            this.offGraphics.beginPath();
            this.offGraphics.moveTo(this.markSprite.startPosition.x, this.markSprite.startPosition.y);
            this.offGraphics.lineTo(dx + this.markSprite.startPosition.x, dy + this.markSprite.startPosition.y);
            this.offGraphics.stroke();
            if (this.viewport2) {
                dx /= 2; dy /= 2;
                if (this.isShow1) {
                    this.offGraphics2.fillStyle = this.color1;
                    this.offGraphics2.fillText("φ: " + phi % 360 + "°", this.centerX2 - this.dCenterX2 + this.dv2, this.centerY2 - this.dv2);
                    this.offGraphics2.strokeStyle = this.color1;
                    this.offGraphics2.beginPath();
                    this.offGraphics2.moveTo(this.centerX2 - this.dCenterX2, this.centerY2);
                    this.offGraphics2.lineTo(dx + this.centerX2 - this.dCenterX2, dy + this.centerY2);
                    this.offGraphics2.arc(this.centerX2 - this.dCenterX2, this.centerY2, this.A * this.dv2, -(phi * Math.PI / 180 + this.Fi), 0);
                    this.offGraphics2.closePath();
                    this.offGraphics2.stroke();
                    this.offGraphics2.drawImage(this.markSprite.image, (this.markSprite.position.x - this.markSprite.startPosition.x) / 2 + this.centerX2 - this.dCenterX2 - this.spriteWidth2, (this.markSprite.position.y - this.markSprite.startPosition.y) / 2 + this.centerY2 - this.spriteHeight2);
                }
                if (this.isShow3) {
                    this.offGraphics2.strokeStyle = this.color1;
                    this.offGraphics2.beginPath();
                    this.offGraphics2.moveTo(this.centerX2, this.centerY2);
                    this.offGraphics2.lineTo(dx + this.centerX2, dy + this.centerY2);
                    this.offGraphics2.stroke();
                }
            }
        }
        if (this.markSprite2) {
            phi2 = this.markSprite2.delta;
            var dx2 = 0, dy2 = 0;
            if (phi2 >= 0) {
                dx2 = Math.round(Math.cos(phi2 * Math.PI / 180 + this.Fi) * this.A * this.dv);
                dy2 = -Math.round(Math.sin(phi2 * Math.PI / 180 + this.Fi) * this.A * this.dv);
            } else phi2 = 0;
            this.offGraphics.strokeStyle = this.color2;
            this.offGraphics.beginPath();
            this.offGraphics.moveTo(this.markSprite2.startPosition.x, this.markSprite2.startPosition.y);
            this.offGraphics.lineTo(dx2 + this.markSprite2.startPosition.x, dy2 + this.markSprite2.startPosition.y);
            this.offGraphics.stroke();
            if (this.viewport2) {
                dx2 /= 2; dy2 /= 2;
                if (this.isShow2) {
                    this.offGraphics2.fillStyle = this.color2;
                    this.offGraphics2.fillText("φ: " + phi2 % 360 + "°", this.centerX2 + this.dCenterX2 + this.dv2, this.centerY2 - this.dv2);

                    this.offGraphics2.strokeStyle = this.color2;
                    this.offGraphics2.beginPath();
                    this.offGraphics2.moveTo(this.centerX2 + this.dCenterX2, this.centerY2);
                    this.offGraphics2.lineTo(dx2 + this.centerX2 + this.dCenterX2, dy2 + this.centerY2);
                    this.offGraphics2.arc(this.centerX2 + this.dCenterX2, this.centerY2, this.A * this.dv2, -(phi2 * Math.PI / 180 + this.Fi), 0);
                    this.offGraphics2.closePath();
                    this.offGraphics2.stroke();
                    this.offGraphics2.drawImage(this.markSprite2.image, (this.markSprite2.position.x - this.markSprite2.startPosition.x) / 2 + this.centerX2 + this.dCenterX2 - this.spriteWidth2, (this.markSprite2.position.y - this.markSprite2.startPosition.y) / 2 + this.centerY2 - this.spriteHeight2);
                }
                if (this.isShow3) {
                    this.offGraphics2.strokeStyle = this.color2;
                    this.offGraphics2.beginPath();
                    this.offGraphics2.moveTo(this.centerX2, this.centerY2);
                    this.offGraphics2.lineTo(dx2 + this.centerX2, dy2 + this.centerY2);
                    this.offGraphics2.stroke();
                }
            }
        }
        if (this.viewport2 && this.markSprite && this.markSprite2) {
            if (this.isShow3) {
                this.offGraphics2.strokeStyle = this.color;
                this.offGraphics2.fillStyle = this.color;
                this.offGraphics2.fillText("Δφ: " + (phi2 - phi) % 360 + "°", this.centerX2 + this.dv2, this.centerY2 - this.dv2);
                this.offGraphics2.beginPath();
                this.offGraphics2.arc(this.centerX2, this.centerY2, this.A * this.dv2, -(phi2 * Math.PI / 180 + this.Fi), -(phi * Math.PI / 180 + this.Fi));
                this.offGraphics2.stroke();
            }
        }

        if (this.isShowLine) {
            this.offGraphics.strokeStyle = this.color;
            this.offGraphics.beginPath();
            for (var x = -this.maxX; x <= this.maxX; x++) {
                s = this.spriteManager.sprites[x];

                if (this.orient.x == 0) {//song ngang
                    this.offGraphics.lineTo(s.position.x, s.position.y);
                } else {
                    this.offGraphics.lineTo(s.position.x, s.position.y - this.dv2 / 2);
                    this.offGraphics.lineTo(s.position.x, s.position.y + this.dv2 / 2);
                }
            }
            this.offGraphics.stroke()
        }

        this.onGraphics.drawImage(this.offImage, this.viewport.x, this.viewport.y);
        if (this.viewport2) this.onGraphics.drawImage(this.offImage2, this.viewport2.x, this.viewport2.y);
    }

    Song.prototype.getA = function () {
        return this.A;
    }
    Song.prototype.getT = function () {
        return this.T;
    }
    Song.prototype.getV = function () {
        return this.V;
    }
    Song.prototype.getFi = function () {
        return this.Fi;
    }

    Song.prototype.setFi = function (fi) {
        this.Fi = fi;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
    }
    Song.prototype.setA = function (a) {
        this.A = a;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
    }
    Song.prototype.setT = function (t) {
        this.T = t;
        this.spriteManager.step = song.Const.solution / (this.T * song.Const.fps);
    }
    Song.prototype.setV = function (v) {
        this.V = v;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            this.spriteManager.sprites[x].startTime = this.density * Math.abs(x - this.xn) * song.Const.fps / this.V;
        }
    }

    Song.prototype.setSrc = function (xs, zs, ys) {
        for (var x = -this.maxX; x <= this.maxX; x++) {
            this.spriteManager.sprites[x].startTime = this.density * Math.abs(x - xs) * song.Const.fps / this.V;
        }
        this.spriteManager.sprites[this.xn].image = this.spriteImage;
        this.spriteManager.sprites[xs].image = this.srcImage;
        this.xn = xs;
        this.update();
    }

    Song.prototype.getSrc = function () {
        return this.xn;
    }

    Song.prototype.setDensity = function (d) {
        this.density = d;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            this.spriteManager.sprites[x].startPosition = {
                x: Math.round(this.density * x * this.dv) + this.centerX,
                y: this.centerY
            };
            this.spriteManager.sprites[x].startTime = this.density * Math.abs(x - this.xn) * song.Const.fps / this.V;
        }
        this.spriteManager.reset();
        this.update();
    }

    Song.prototype.getDensity = function () {
        return this.density;
    }

    Song.prototype.click = function (evt) {
        var p = {
            x: evt.offsetX,
            y: evt.offsetY
        };
        var center = {};
        var s;
        for (var x = -that.maxX; x <= that.maxX; x++) {
            s = that.spriteManager.sprites[x];
            center.x = s.position.x + that.viewport.x;
            center.y = s.position.y + that.viewport.y;
            if (center.x - that.spriteWidth2 <= p.x && p.x <= center.x + that.spriteWidth2 && center.y - that.spriteHeight2 <= p.y && p.y <= center.y + that.spriteHeight2) {//click hit
                if (!evt.ctrlKey) {
                    if (s == that.markSprite) {//bo chon
                        that.markSprite.image = that.spriteImage;
                        that.markSprite = null;
                    }
                    else {
                        if (that.markSprite)
                            that.markSprite.image = that.spriteImage;
                        that.markSprite = s;
                        that.markSprite.image = that.markImage;
                    }
                } else {
                    if (s == that.markSprite2) {
                        that.markSprite2.image = that.spriteImage2;
                        that.markSprite2 = null;
                    }
                    else {
                        if (that.markSprite2)
                            that.markSprite2.image = that.spriteImage;
                        that.markSprite2 = s;
                        that.markSprite2.image = that.markImage2;
                    }
                }
                that.update();
            }
        }
    }



    Song.prototype.showOrdinate = function (isShow) {
        //do nothing
    }

    Song.prototype.show = function (flag) {
        switch (flag) {
            case 1: this.isShow1 = true; break;
            case -1: this.isShow1 = false; break;
            case 2: this.isShow2 = true; break;
            case -2: this.isShow2 = false; break;
            case 3: this.isShow3 = true; break;
            case -3: this.isShow3 = false; break;

            case 4: this.isShowLine = true; break;
            case -4: this.isShowLine = false; break;
        }
        this.update();
    }

    Song.prototype.setSnap = function (t) {
        this.snap = t * song.Const.fps;
    }

    Song.prototype.getSnap = function () {
        return this.snap / song.Const.fps;
    }

    Song.prototype.getOrient = function () {
        return this.orient;
    }

    Song.prototype.setOrient = function (orient) {
        this.orient = orient;
        var s;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            s = this.spriteManager.sprites[x];
            s.orientVectorX = this.orient.x;
            s.orientVectorY = this.orient.y;
        }
    }

    return Song;
} ();                                                    //end class Song
/////////////////////////////////////////////////