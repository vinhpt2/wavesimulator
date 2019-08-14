//file GiaoThoaSpriteZManager.java
/////////////////////////////////////////////////
var song;
if(!song)song={};
if(!song.sprite)song.sprite={};

/////////////////////////////////////////////////

song.sprite.GiaoThoaSprite3DManager = function () {//quản lí các con rối

    function GiaoThoaSprite3DManager(sprites, planes, buf, step, buf2, step2, space) {

        this.sprites = sprites; //các con rối cần quản lí
        this.planes = planes; //ảnh nền
        this.posBuffer = buf; //các giá trị lượng tử trong một chu kì được tính sẵn
        this.posBuffer2 = buf2;
        this.time = 0; //nhịp đồng hồ
        this.step = step; //khoảng nhảy lượng tử ứng với một nhịp đồng hồ
        this.step2 = step2;
        this.space = space;
    }

    GiaoThoaSprite3DManager.prototype.update = function () {//tính toán vị trí mới của các con rối khi nhịp đồng hồ đập
        var positions, normals, s, j;
        for (var m = 0; m < this.planes.length; m++) {
            positions = this.planes[m].getVerticesData(BABYLON.VertexBuffer.PositionKind);
            j = 0;
            for (var i = 0; i < positions.length; i += 3) {
                s = this.sprites[m][j++];
                s.delta = (Math.round((this.time - s.startTime) * this.step)) % song.Const.solution;
                s.delta2 = (Math.round((this.time - s.startTime2) * this.step)) % song.Const.solution;
                if (this.time > s.startTime) {
                    s.position1.x = s.orientVectorX * this.posBuffer[s.delta] + s.startPosition.x;
                    s.position1.y = s.orientVectorY * this.posBuffer[s.delta] + s.startPosition.y;
                    s.position1.z = s.orientVectorZ * this.posBuffer[s.delta] + s.startPosition.z;
                }
                if (this.time > s.startTime2) {
                    s.position2.x = s.orientVectorX2 * this.posBuffer2[s.delta2] + s.startPosition.x;
                    s.position2.y = s.orientVectorY2 * this.posBuffer2[s.delta2] + s.startPosition.y;
                    s.position2.z = s.orientVectorZ2 * this.posBuffer2[s.delta2] + s.startPosition.z;
                }
                s.image.position.x =positions[i]= s.position1.x + s.position2.x - s.startPosition.x;
                s.image.position.y = positions[i+1] = s.position1.y + s.position2.y - s.startPosition.y;
                s.image.position.z = positions[i+2] = s.position1.z + s.position2.z - s.startPosition.z;
            }
            normals = this.planes[m].getVerticesData(BABYLON.VertexBuffer.NormalKind);
            if (normals) {
                BABYLON.VertexData.ComputeNormals(positions, this.planes[m].getIndices(), normals);
                this.planes[m].updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
            }
            this.planes[m].updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

        }
    }

    GiaoThoaSprite3DManager.prototype.reset = function () {
        var positions, normals, s, j;
        for (var m = 0; m < this.planes.length; m++) {
            positions = this.planes[m].getVerticesData(BABYLON.VertexBuffer.PositionKind);
            j = 0;
            for (var i = 0; i < positions.length; i += 3) {
                s = this.sprites[m][j++];
                s.delta = s.delta2=0;
                s.image.position.x = s.position1.x=s.position2.x = positions[i] = s.startPosition.x;
                s.image.position.y = s.position1.y=s.position2.y = positions[i + 1] = s.startPosition.y;
                s.image.position.z = s.position1.z=s.position2.z = positions[i + 2] = s.startPosition.z;

            }
            normals = this.planes[m].getVerticesData(BABYLON.VertexBuffer.NormalKind);
            if (normals) {
                BABYLON.VertexData.ComputeNormals(positions, this.planes[m].getIndices(), normals);
                this.planes[m].updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
            }
            this.planes[m].updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

        }
        this.time = 0;
    }
    return GiaoThoaSprite3DManager;
} ();   //end class GiaoThoaSprite3DManager

/////////////////////////////////////////////////
//end file GiaoThoaSpriteZManager.java