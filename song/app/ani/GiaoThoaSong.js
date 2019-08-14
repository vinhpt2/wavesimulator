//file GiaoThoaSong.js
/////////////////////////////////////////////////
var song;
if(!song)song={};
if(!song.ani)song.ani={};

/////////////////////////////////////////////////

song.ani.GiaoThoaSong = function () { //implements ISongVimo
    var that;
    function GiaoThoaSong(canvas, params) {
        this.spriteWidth = 7;
        this.spriteWidth2 = Math.floor(this.spriteWidth / 2);
        this.spriteHeight = 7;
        this.spriteHeight2 = Math.floor(this.spriteHeight / 2);

        this.color = "lime";
        this.color1 = "red";
        this.color2 = "blue";


        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShowLine = false;
        this.isStand = false;
        this.isFix = true;
        this.viewport = {
            x: 0,
            y: 0,
            width: 481,
            height: 241
        };

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
        this.srcImage.src = "images/2d/Red.gif";
        this.srcImage2 = new Image();
        this.srcImage2.src = "images/2d/Blue.gif";

        this.markImage = new Image();
        this.markImage.src = "images/2d/Yellow.gif";

        this.offImage = document.createElement('canvas');
        this.offImage.width = this.viewport.width;
        this.offImage.height = this.viewport.height;
        this.offGraphics = this.offImage.getContext("2d");
        this.canvas = canvas;
        this.canvas.onclick = this.click;
        this.onGraphics = this.canvas.getContext("2d");

        this.viewport2 = {
            x: 0,
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
        this.backImage.onload = function () { that.update() };
        this.init(params);
    }


    GiaoThoaSong.prototype.init = function (params) {

        this.A = params.A;
        this.T = params.T;
        this.V = params.V;
        this.Fi = params.Fi;
        this.xn = params.xn;
        this.A2 = params.A2;
        this.T2 = params.T2;
        this.V2 = params.V2;
        this.Fi2 = params.Fi2;
        this.xn2 = params.xn2;
        this.density = params.density;
        this.maxX = params.maxX;
        this.dv = params.dv;
        this.dv2 = Math.floor(this.dv / 2);
        this.centerX = params.centerX;
        this.centerY = params.centerY;
        this.centerX2 = params.centerX2;
        this.centerY2 = params.centerY2;
        this.orient = params.orient;
        this.orient2 = params.orient2;
        this.clockCenterX = params.clockCenterX;
        this.clockCenterY = params.clockCenterY;
        this.digitWidth = params.digitWidth;
        this.dCenterX2 = params.dCenterX2;
        this.snap = params.snap;



        var buf = [];
        for (var i = 0; i < song.Const.solution; i++)
            buf[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
        var buf2 = [];
        for (var i = 0; i < song.Const.solution; i++)
            buf2[i] = (this.A2 * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi2));

        var sprites = [];
        var startTime, startTime2, d, d2;
        var startPoint;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            d = this.density * Math.abs(x - this.xn);
            startTime = d * song.Const.fps / this.V;
            d2 = this.density * Math.abs(x - this.xn2);
            startTime2 = d2 * song.Const.fps / this.V2;
            startPoint = {
                x: Math.round(this.density * x * this.dv) + this.centerX,
                y: this.centerY
            };
            sprites[x] = new song.Const.newSprite(this.spriteImage, this.spriteWidth, this.spriteHeight, startPoint, this.orient, startTime, this.orient2, startTime2);

        }
        sprites[this.xn].image = this.srcImage;
        sprites[this.xn2].image = this.srcImage2;

        var step = song.Const.solution / (this.T * song.Const.fps);
        var step2 = song.Const.solution / (this.T2 * song.Const.fps);
        this.spriteManager = new song.sprite.GiaoThoaSpriteManager(sprites, this.backImage, buf, step, buf2, step2);

    }

    GiaoThoaSong.prototype.reset = function () {
        this.spriteManager.reset();
        this.update();
    }

    GiaoThoaSong.prototype.run = function () {
        this.spriteManager.update();
        this.update();
        this.spriteManager.time++;

        return (this.spriteManager.time <= this.snap);
    }

    GiaoThoaSong.prototype.update = function () {
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
            phi2 = this.markSprite.delta2;
            var dx2 = 0, dy2 = 0;
            if (phi2 >= 0) {
                dx2 = Math.round(Math.cos(phi2 * Math.PI / 180 + this.Fi2) * this.A2 * this.dv);
                dy2 = -Math.round(Math.sin(phi2 * Math.PI / 180 + this.Fi2) * this.A2 * this.dv);
            } else phi2 = 0;

            this.offGraphics.strokeStyle = this.color;
            this.offGraphics.beginPath();
            this.offGraphics.moveTo(this.markSprite.startPosition.x, this.markSprite.startPosition.y);
            this.offGraphics.lineTo(dx + dx2 + this.markSprite.startPosition.x, dy + dy2 + this.markSprite.startPosition.y);
            this.offGraphics.stroke();
            if (this.viewport2) {
                if (this.isShow1) {
                    this.offGraphics.strokeStyle = this.color1;
                    this.offGraphics.beginPath();
                    this.offGraphics.moveTo(this.markSprite.startPosition.x, this.markSprite.startPosition.y);
                    this.offGraphics.lineTo(dx + this.markSprite.startPosition.x, dy + this.markSprite.startPosition.y);
                    this.offGraphics.stroke();
                    dx /= 2; dy /= 2;
                    this.offGraphics2.fillStyle = this.color1;
                    this.offGraphics2.fillText("φ: " + phi % 360 + "°", this.centerX2 - this.dCenterX2 + this.dv2, this.centerY2 - this.dv2);
                    this.offGraphics2.strokeStyle = this.color1;
                    this.offGraphics2.beginPath();
                    this.offGraphics2.moveTo(this.centerX2 - this.dCenterX2, this.centerY2);
                    this.offGraphics2.lineTo(dx + this.centerX2 - this.dCenterX2, dy + this.centerY2);
                    this.offGraphics2.arc(this.centerX2 - this.dCenterX2, this.centerY2, this.A * this.dv2, -(phi * Math.PI / 180 + this.Fi), 0);
                    this.offGraphics2.closePath();
                    this.offGraphics2.stroke();
                }
                if (this.isShow2) {
                    this.offGraphics.strokeStyle = this.color2;
                    this.offGraphics.beginPath();
                    this.offGraphics.moveTo(this.markSprite.startPosition.x, this.markSprite.startPosition.y);
                    this.offGraphics.lineTo(dx2 + this.markSprite.startPosition.x, dy2 + this.markSprite.startPosition.y);
                    this.offGraphics.stroke();
                    dx2 /= 2; dy2 /= 2;
                    this.offGraphics2.fillStyle = this.color2;
                    this.offGraphics2.fillText("φ: " + phi2 % 360 + "°", this.centerX2 + this.dCenterX2 + this.dv2, this.centerY2 - this.dv2);
                    this.offGraphics2.strokeStyle = this.color2;
                    this.offGraphics2.beginPath();
                    this.offGraphics2.moveTo(this.centerX2 + this.dCenterX2, this.centerY2);
                    this.offGraphics2.lineTo(dx2 + this.centerX2 + this.dCenterX2, dy2 + this.centerY2);
                    this.offGraphics2.arc(this.centerX2 + this.dCenterX2, this.centerY2, this.A2 * this.dv2, -(phi2 * Math.PI / 180 + this.Fi), 0);
                    this.offGraphics2.closePath();
                    this.offGraphics2.stroke();
                }
                if (this.isShow3) {
                    this.offGraphics2.fillStyle = this.color;
                    this.offGraphics2.fillText("Δφ: " + (phi2 - phi) % 360 + "°", this.centerX2 + this.dv2, this.centerY2 - this.dv2);
                    this.offGraphics2.beginPath();
                    this.offGraphics2.strokeStyle = this.color;
                    this.offGraphics2.moveTo(this.centerX2, this.centerY2);
                    this.offGraphics2.lineTo(dx + dx2 + this.centerX2, dy + dy2 + this.centerY2);
                    this.offGraphics2.stroke();
                    this.offGraphics2.beginPath();
                    this.offGraphics2.strokeStyle = this.color1;
                    this.offGraphics2.moveTo(this.centerX2, this.centerY2);
                    this.offGraphics2.lineTo(dx + this.centerX2, dy + this.centerY2);
                    this.offGraphics2.stroke();
                    this.offGraphics2.beginPath();
                    this.offGraphics2.strokeStyle = this.color2;
                    this.offGraphics2.moveTo(this.centerX2, this.centerY2);
                    this.offGraphics2.lineTo(dx2 + this.centerX2, dy2 + this.centerY2);
                    this.offGraphics2.stroke();

                    this.offGraphics2.drawImage(this.markImage, (this.markSprite.position.x - this.markSprite.startPosition.x) / 2 + this.centerX2 - this.spriteWidth2, (this.markSprite.position.y - this.markSprite.startPosition.y) / 2 + this.centerY2 - this.spriteHeight2);
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
            var s = this.spriteManager.sprites[0];
            this.offGraphics.moveTo(s.position.x, s.position.y);
            for (var x = -this.maxX; x <= this.maxX; x++) {
                s = this.spriteManager.sprites[x];

                if (this.orientX == 0) {//song ngang
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

    GiaoThoaSong.prototype.getA = function () {
        return this.A;
    }
    GiaoThoaSong.prototype.getA2 = function () {
        return this.A2;
    }
    GiaoThoaSong.prototype.getT = function () {
        return this.T;
    }
    GiaoThoaSong.prototype.getT2 = function () {
        return this.T2;
    }
    GiaoThoaSong.prototype.getV = function () {
        return this.V;
    }
    GiaoThoaSong.prototype.getV2 = function () {
        return this.V2;
    }
    GiaoThoaSong.prototype.getFi = function () {
        return this.Fi;
    }
    GiaoThoaSong.prototype.getFi2 = function () {
        return this.Fi2;
    }
    GiaoThoaSong.prototype.setFi = function (fi) {
        this.Fi = fi;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
    }
    GiaoThoaSong.prototype.setFi2 = function (fi2) {
        this.Fi2 = fi2;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer2[i] = (this.A2 * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi2));
    }
    GiaoThoaSong.prototype.setA = function (a) {
        this.A = a;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
    }
    GiaoThoaSong.prototype.setA2 = function (a) {
        this.A2 = a;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer2[i] = (this.A2 * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi2));
    }
    GiaoThoaSong.prototype.setT = function (t) {
        this.T = t;
        this.spriteManager.step = song.Const.solution / (this.T * song.Const.fps);
    }
    GiaoThoaSong.prototype.setT2 = function (t2) {
        this.T2 = t2;
        this.spriteManager.step2 = song.Const.solution / (this.T2 * song.Const.fps);
    }
    GiaoThoaSong.prototype.setV = function (v) {
        this.V = v;
        var x = 0;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            this.spriteManager.sprites[x].startTime = this.density * Math.abs(x - this.xn) * song.Const.fps / this.V;
        }
    }
    GiaoThoaSong.prototype.setV2 = function (v2) {
        this.V2 = v2;
        var x = 0;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            this.spriteManager.sprites[x].startTime2 = this.density * Math.abs(x - this.xn2) * song.Const.fps / this.V2;
        }
    }

    GiaoThoaSong.prototype.setSrc = function (xs, zs, ys) {
        var x = 0;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            this.spriteManager.sprites[x].startTime = this.density * Math.abs(x - xs) * song.Const.fps / this.V;
        }
        this.spriteManager.sprites[this.xn].image = this.spriteImage;
        this.spriteManager.sprites[xs].image = this.srcImage;
        this.xn = xs;
        this.update();
    }

    GiaoThoaSong.prototype.setSrc2 = function (xs2, zs2, ys2) {
        var x = 0;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            this.spriteManager.sprites[x].startTime = this.density * Math.abs(x - xs2) * song.Const.fps / this.V;
        }
        this.spriteManager.sprites[this.xn2].image = this.spriteImage;
        this.spriteManager.sprites[xs2].image = this.srcImage;
        this.xn = xs2;
        this.update();
    }

    GiaoThoaSong.prototype.getSrc = function () {
        return this.xn;
    }
    GiaoThoaSong.prototype.getSrc2 = function () {
        return this.xn2;
    }

    GiaoThoaSong.prototype.setDensity = function (d) {
        this.density = d;
        var x = 0;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            this.spriteManager.sprites[x].startPosition = {
                x: Math.round(this.density * x * this.dv) + this.centerX,
                y: this.centerY
            };
            this.spriteManager.sprites[x].startTime = this.density * Math.abs(x - this.xn) * song.Const.fps / this.V;
            this.spriteManager.sprites[x].startTime2 = this.density * Math.abs(x - this.xn2) * song.Const.fps / this.V2;
        }
        this.spriteManager.reset();
        this.update();
    }

    GiaoThoaSong.prototype.getDensity = function () {
        return this.density;
    }

    GiaoThoaSong.prototype.click = function (evt) {
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

                that.update();
            }
        }
    }



    GiaoThoaSong.prototype.standing = function () {
        //SONG DUNG
        if (this.isStand) {
            var s, d2;
            this.A2 = this.A;
            this.T2 = this.T;
            this.V2 = this.V;
            this.Fi2 = this.isFix ? this.Fi + Math.PI : this.Fi;
            this.spriteManager.backImage.src = this.isFix ? "images/2d/TrucToaDo3.gif" : (this.orient2.y ? "images/2d/TrucToaDo4.gif" : "images/2d/TrucToaDo5.gif");
            for (var x = -this.maxX; x <= this.maxX; x++) {
                s = this.spriteManager.sprites[x];
                s.startTime2 = this.density * Math.abs(x - this.xn2) * song.Const.fps / this.V + this.density * Math.abs(this.xn - this.xn2) * song.Const.fps / this.V;
            }
            this.spriteManager.step2 = this.spriteManager.step;
            for (var i = 0; i < song.Const.solution; i++)
                this.spriteManager.posBuffer2[i] = (this.A * this.dv * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi2));

        } else {
            this.spriteManager.backImage.src = "images/2d/TrucToaDo.gif";
        }
    }

    GiaoThoaSong.prototype.show = function (flag) {
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

    GiaoThoaSong.prototype.setSnap = function (t) {
        this.snap = t * song.Const.fps;
    }

    GiaoThoaSong.prototype.getSnap = function () {
        return this.snap / song.Const.fps;
    }

    GiaoThoaSong.prototype.getOrient = function () {
        return {
            x: this.orientX,
            y: this.orientY
        };
    }

    GiaoThoaSong.prototype.setOrient = function (orient) {
        this.orient = orient;
        var s;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            s = this.spriteManager.sprites[x];
            s.orientVectorX = this.orient.x;
            s.orientVectorY = this.orient.y;
        }
    }

    GiaoThoaSong.prototype.setOrient2 = function (orient2) {
        this.orient2 = orient2;
        var s;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            s = this.spriteManager.sprites[x];
            s.orientVectorX2 = this.orient2.x;
            s.orientVectorY2 = this.orient2.y;
        }
    }

    return GiaoThoaSong;
} ();                                                              //end class GiaoThoaSong
/////////////////////////////////////////////////