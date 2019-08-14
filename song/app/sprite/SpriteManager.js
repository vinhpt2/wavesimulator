//file spritemanager.java
/////////////////////////////////////////////////
var song;
if(!song)song={};
if(!song.sprite)song.sprite={};

/////////////////////////////////////////////////

song.sprite.SpriteManager = function () {//quản lí các con rối

    function SpriteManager(sprites, backImage, buf, step) {
        this.maxX= Math.floor(sprites.length/2);
        this.sprites = sprites; //các con rối cần quản lí
        this.backImage = backImage; //ảnh nền
        this.posBuffer = buf; //các giá trị lượng tử trong một chu kì được tính sẵn
        this.time = 0; //nhịp đồng hồ
        this.step = step; //khoảng nhảy lượng tử ứng với một nhịp đồng hồ
    }

    SpriteManager.prototype.update = function () {//tính toán vị trí mới của các con rối khi nhịp đồng hồ đập
        var s;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            s = this.sprites[x];
            s.delta = (Math.round((this.time - s.startTime) * this.step)) % song.Const.solution;
            if (this.time > s.startTime) {
                s.position.x = Math.round(s.orientVectorX * this.posBuffer[s.delta]) + s.startPosition.x;
                s.position.y = Math.round(s.orientVectorY * this.posBuffer[s.delta]) + s.startPosition.y;
            }
        }
    }

    SpriteManager.prototype.draw = function (graphics) {//vẽ các con rối lên màn hình ở vị trí hiện tại
        var s;
        graphics.drawImage(this.backImage, 0, 0);
        for (var x = -this.maxX; x <= this.maxX; x++) {
            s = this.sprites[x];
            graphics.drawImage(s.image, s.position.x - s.width2, s.position.y - s.height2);
        }
    }

    SpriteManager.prototype.reset = function () {
        var s;
        for (var x = -this.maxX; x <= this.maxX; x++) {
            s = this.sprites[x];
            s.position.x = s.startPosition.x;
            s.position.y = s.startPosition.y;
            s.delta = 0;
        }
        this.time = 0;
    }
    return SpriteManager;
} ();  //end class SpriteManager

/////////////////////////////////////////////////
//end file spritemanager.java