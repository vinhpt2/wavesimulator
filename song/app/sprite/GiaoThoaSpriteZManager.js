﻿//file GiaoThoaSpriteZManager.java
/////////////////////////////////////////////////
var song;
if(!song)song={};
if(!song.sprite)song.sprite={};

/////////////////////////////////////////////////

song.sprite.GiaoThoaSpriteZManager = function () {//quản lí các con rối

    function GiaoThoaSpriteZManager(sprites, backImage, buf, step, buf2, step2, space) {
        this.maxX = sprites.length - 1;
        this.maxZ = sprites[0].length - 1;
        this.maxY = sprites[0][0].length - 1;
        this.sprites = sprites; //các con rối cần quản lí
        this.backImage = backImage; //ảnh nền
        this.posBuffer = buf; //các giá trị lượng tử trong một chu kì được tính sẵn
        this.posBuffer2 = buf2;
        this.time = 0; //nhịp đồng hồ
        this.step = step; //khoảng nhảy lượng tử ứng với một nhịp đồng hồ
        this.step2 = step2;
        this.space = space;
    }

    GiaoThoaSpriteZManager.prototype.update = function () {//tính toán vị trí mới của các con rối khi nhịp đồng hồ đập
        var s;
        for (var x = -this.maxX; x <= this.maxX; x++)
            for (var z = -this.maxZ; z <= this.maxZ; z++)
                for (var y = -this.maxY; y <= this.maxY; y++)
                    if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                        s = this.sprites[x][z][y];
                        s.delta = (Math.round((this.time - s.startTime) * this.step)) % song.Const.solution;
                        s.delta2 = (Math.round((this.time - s.startTime2) * this.step2)) % song.Const.solution;
                        if (this.time > s.startTime) {
                            s.position1.x = Math.round(s.orientVectorX * this.posBuffer[s.delta]) + s.startPosition.x;
                            s.position1.y = Math.round(s.orientVectorY * this.posBuffer[s.delta]) + s.startPosition.y;
                        }
                        if (this.time > s.startTime2) {
                            s.position2.x = Math.round(s.orientVectorX2 * this.posBuffer2[s.delta2]) + s.startPosition.x;
                            s.position2.y = Math.round(s.orientVectorY2 * this.posBuffer2[s.delta2]) + s.startPosition.y;
                        }
                        s.position.x = s.position1.x + s.position2.x - s.startPosition.x;
                        s.position.y = s.position1.y + s.position2.y - s.startPosition.y;
                    }
    }

    GiaoThoaSpriteZManager.prototype.draw = function (graphics) {//vẽ các con rối lên màn hình ở vị trí hiện tại
        var s;
        graphics.drawImage(this.backImage, 0, 0);
        for (var x = -this.maxX; x <= this.maxX; x++)
            for (var z = -this.maxZ; z <= this.maxZ; z++)
                for (var y = -this.maxY; y <= this.maxY; y++)
                    if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                        s = this.sprites[x][z][y];
                        graphics.drawImage(s.image, s.position.x - s.width2, s.position.y - s.height2);
                    }
    }

    GiaoThoaSpriteZManager.prototype.reset = function () {
        var s;
        for (var x = -this.maxX; x <= this.maxX; x++)
            for (var z = -this.maxZ; z <= this.maxZ; z++)
                for (var y = -this.maxY; y <= this.maxY; y++)
                    if ((x % this.space == 0 && y % this.space == 0) || (y % this.space == 0 && z % this.space == 0) || (z % this.space == 0 && x % this.space == 0)) {
                        s = this.sprites[x][z][y];
                        s.position.x = s.position1.x = s.position2.x = s.startPosition.x;
                        s.position.y = s.position1.y = s.position2.y = s.startPosition.y;
                        s.delta = s.delta2 = 0;
                    }
        this.time = 0;
    }
    return GiaoThoaSpriteZManager;
} ();   //end class GiaoThoaSpriteZManager

/////////////////////////////////////////////////
//end file GiaoThoaSpriteZManager.java