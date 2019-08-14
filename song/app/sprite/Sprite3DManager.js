//file SpriteZManager.java
/////////////////////////////////////////////////
var song;
if(!song)song={};
if(!song.sprite)song.sprite={};

/////////////////////////////////////////////////

song.sprite.Sprite3DManager = function () {//quản lí các con rối

    function Sprite3DManager(sprites, planes, buf, step, space) {
        this.sprites = sprites; //các con rối cần quản lí
        this.planes = planes;
        this.posBuffer = buf; //các giá trị lượng tử trong một chu kì được tính sẵn
        this.time = 0; //nhịp đồng hồ
        this.step = step; //khoảng nhảy lượng tử ứng với một nhịp đồng hồ
        this.space = space;
    }

    Sprite3DManager.prototype.update = function () {//tính toán vị trí mới của các con rối khi nhịp đồng hồ đập
        var positions, normals, s, j;
        for (var m = 0; m < this.planes.length; m++) {
            positions = this.planes[m].getVerticesData(BABYLON.VertexBuffer.PositionKind);
            j = 0;
            for (var i = 0; i < positions.length; i += 3) {
                s = this.sprites[m][j++];
                s.delta = (Math.round((this.time - s.startTime) * this.step)) % song.Const.solution;
                if (this.time > s.startTime) {
                    s.image.position.x = positions[i] = s.orientVectorX * this.posBuffer[s.delta] + s.startPosition.x;
                    s.image.position.y = positions[i + 1] = s.orientVectorY * this.posBuffer[s.delta] + s.startPosition.y;
                    s.image.position.z = positions[i + 2] = s.orientVectorZ * this.posBuffer[s.delta] + s.startPosition.z;
                }
            }
            normals = this.planes[m].getVerticesData(BABYLON.VertexBuffer.NormalKind);
            if (normals) {
                BABYLON.VertexData.ComputeNormals(positions, this.planes[m].getIndices(), normals);
                this.planes[m].updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
            }
            this.planes[m].updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

        }
    }

    Sprite3DManager.prototype.reset = function () {
        var positions, normals, s, j;
        for (var m = 0; m < this.planes.length; m++) {
            positions = this.planes[m].getVerticesData(BABYLON.VertexBuffer.PositionKind);
            j = 0;
            for (var i = 0; i < positions.length; i += 3) {
                s = this.sprites[m][j++];
                s.delta = 0;
                s.image.position.x = positions[i] = s.startPosition.x;
                s.image.position.y = positions[i + 1] = s.startPosition.y;
                s.image.position.z = positions[i + 2] = s.startPosition.z;

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
    return Sprite3DManager;
} ();                            //end class Sprite3DManager

/////////////////////////////////////////////////
//end file SpriteZManager.java