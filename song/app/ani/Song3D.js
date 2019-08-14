//file SongZ.js
/////////////////////////////////////////////////
var song;
if (!song) song = {};
if (!song.ani) song.ani = {};

/////////////////////////////////////////////////

song.ani.Song3D = function () { //implements ISongVimo
    var that;
    function Song3D(canvas, params) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0, 0, 0);

        this.camera = new BABYLON.FreeCamera("camFree", new BABYLON.Vector3(0, 20, -40), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.canvas);
        this.cameraArc = new BABYLON.ArcRotateCamera("camArc", -Math.PI / 2, Math.PI / 3, 45, new BABYLON.Vector3(0, 0, 0), this.scene);
        this.cameraArc.attachControl(this.canvas);
        var light = new BABYLON.HemisphericLight("lightHem", new BABYLON.Vector3(-1, 1, 1), this.scene);

        this.materialEle = new BABYLON.StandardMaterial("MAT_E", this.scene);
        this.materialEle.diffuseColor = new BABYLON.Color3(0, 1, 0);
        this.materialEle.specularColor = new BABYLON.Color3(1, 1, 1);

        this.materialMark = new BABYLON.StandardMaterial("MAT_M", this.scene);
        this.materialMark.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.materialMark.specularColor = new BABYLON.Color3(1, 1, 1);

        this.sphere = BABYLON.Mesh.CreateSphere("SPH", 8, 0.2, this.scene);
        this.sphere.material = new BABYLON.StandardMaterial("MAT_SE", this.scene);
        this.sphere.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        this.sphere.setEnabled(false);

        this.sphereSrc = BABYLON.Mesh.CreateSphere("SPH_S", 10, 0.4, this.scene);
        this.sphereSrc.material = new BABYLON.StandardMaterial("MAT_SS", this.scene);
        this.sphereSrc.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        this.sphereSrc.setEnabled(false);

        this.sphereMark = BABYLON.Mesh.CreateSphere("SPH_M", 8, 0.2, this.scene);
        this.sphereMark.material = new BABYLON.StandardMaterial("MAT_M", this.scene);
        this.sphereMark.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.sphereMark.setEnabled(false);

        this.coordX = BABYLON.Mesh.CreateLines("coordX", [new BABYLON.Vector3(-100, 0, 0), new BABYLON.Vector3(100, 0, 0)], this.scene);
        this.coordX.setEnabled(false);
        this.coordY = BABYLON.Mesh.CreateLines("coordY", [new BABYLON.Vector3(0, -100, 0), new BABYLON.Vector3(0, 100, 0)], this.scene);
        this.coordY.setEnabled(false);
        this.coordZ = BABYLON.Mesh.CreateLines("coordZ", [new BABYLON.Vector3(0, 0, -100), new BABYLON.Vector3(0, 0, 100)], this.scene);
        this.coordZ.setEnabled(false);


        that = this;
        this.init(params);
        this.engine.runRenderLoop(function (time) {
            if (isRunning && isLiving) {
                if (time - startTime > song.Const.delay) {
                    startTime = time;
                    isLiving = that.run();
                }
            }
            that.scene.render();
        });
    }

    Song3D.prototype.init = function (params) {
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
            buf[i] = (this.A * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));

        if (this.spriteManager) {
            for (var m = 0; m < this.spriteManager.planes.length; m++) {
                this.scene.removeMesh(this.spriteManager.planes[m]);
                for (var i = 0; i < this.spriteManager.sprites[m].length; i++)
                    this.scene.removeMesh(this.spriteManager.sprites[m][i].image);
            }
        }

        var plane, markX, markY, markZ, planes;
        if (this.isWater) {
            plane = BABYLON.Mesh.CreateGround("GRID", this.maxX * 2, this.maxZ * 2, this.maxX * 2, this.maxZ * 2, this.scene, true);
            plane.material = this.materialEle;
            var xPoints = [];
            for (var x = -this.maxX; x <= this.maxX; x++)
                xPoints.push(new BABYLON.Vector3(x, 0, 0));
            markX = BABYLON.Mesh.CreateLines("MARK_X", xPoints, this.scene, true);
            markX.color = new BABYLON.Color3(1, 0, 0);
            markX.setEnabled(false);
            var zPoints = [];
            for (var z = -this.maxZ; z <= this.maxZ; z++)
                zPoints.push(new BABYLON.Vector3(0, 0, z));
            markZ = BABYLON.Mesh.CreateLines("MARK_Z", zPoints, this.scene, true);
            markZ.color = new BABYLON.Color3(1, 0, 0);
            markZ.setEnabled(false);
            planes = [plane, markX, markZ];
        } else {
            var ceil = BABYLON.Mesh.CreateGround("CEIL", this.maxX * 2, this.maxZ * 2, this.maxX * 2, this.maxZ * 2, this.scene, true);
            ceil.position.y = this.maxY;
            var floor = BABYLON.Mesh.CreateGround("FLOOR", this.maxX * 2, this.maxZ * 2, this.maxX * 2, this.maxZ * 2, this.scene, true);
            floor.position.y = -this.maxY;
            floor.rotation.x = Math.PI;
            var left = BABYLON.Mesh.CreateGround("LEFT", this.maxY * 2, this.maxZ * 2, this.maxY * 2, this.maxZ * 2, this.scene, true);
            left.position.x = -this.maxX;
            left.rotation.z = Math.PI / 2;
            var right = BABYLON.Mesh.CreateGround("RIGHT", this.maxY * 2, this.maxZ * 2, this.maxY * 2, this.maxZ * 2, this.scene, true);
            right.position.x = this.maxX;
            right.rotation.z = -Math.PI / 2;
            var front = BABYLON.Mesh.CreateGround("FRONT", this.maxX * 2, this.maxY * 2, this.maxX * 2, this.maxY * 2, this.scene, true);
            front.position.z = -this.maxZ;
            front.rotation.x = -Math.PI / 2;
            var behind = BABYLON.Mesh.CreateGround("BEHIND", this.maxX * 2, this.maxY * 2, this.maxX * 2, this.maxY * 2, this.scene, true);
            behind.position.z = this.maxZ;
            behind.rotation.x = Math.PI / 2;

            plane = BABYLON.Mesh.MergeMeshes([ceil, floor, left, right, front, behind]);
            plane.material = this.materialEle;
            markX = BABYLON.Mesh.CreateGround("MARK_X", this.maxY * 2, this.maxZ * 2, this.maxY * 2, this.maxZ * 2, this.scene, true);
            markX.rotation.z = -Math.PI / 2;
            markX.material = this.materialMark;
            markX = BABYLON.Mesh.MergeMeshes([markX]);
            markX.setEnabled(false);
            markY = BABYLON.Mesh.CreateGround("MARK_Y", this.maxX * 2, this.maxZ * 2, this.maxX * 2, this.maxZ * 2, this.scene, true);
            markY.material = this.materialMark;
            markY = BABYLON.Mesh.MergeMeshes([markY]);
            markY.setEnabled(false);
            markZ = BABYLON.Mesh.CreateGround("MARK_Z", this.maxX * 2, this.maxY * 2, this.maxX * 2, this.maxY * 2, this.scene, true);
            markZ.rotation.x = -Math.PI / 2;
            markZ.material = this.materialMark;
            markZ = BABYLON.Mesh.MergeMeshes([markZ]);
            markZ.setEnabled(false);
            planes = [plane, markX, markZ, markY];
        }

        var sprites = [];
        var image, positions;
        var startTime, startPoint, orient;
        var j, d, x, y, z;

        for (var m = 0; m < planes.length; m++) {
            sprites[m] = [];
            positions = planes[m].getVerticesData(BABYLON.VertexBuffer.PositionKind);
            j = 0;
            for (var i = 0; i < positions.length; i += 3) {
                x = positions[i];
                y = positions[i + 1];
                z = positions[i + 2];

                d = (this.dimension == 1) ? Math.abs(x - this.xn) : Math.sqrt((x - this.xn) * (x - this.xn) + (z - this.zn) * (z - this.zn) + (y - this.yn) * (y - this.yn));
                startTime = d * song.Const.fps / this.V;
                startPosition = { x: x , y: y , z: z };
                orient = this.isWater ? { x: 0, y: 1, z: 0} : (this.dimension == 1) ? { x: 1, y: 0, z: 0} : ((d == 0) ? { x: 0, y: 0, z: 0} :
                {
                    x: (x - this.xn) / d,
                    y: (y - this.yn) / d,
                    z: (z - this.zn) / d
                });
                if (x == this.xn && y == this.yn && z == this.zn) {
                    image = this.sphereSrc.createInstance(m + "ELE" + j);
                } else {
                    image = (m == 0) ? this.sphere.createInstance(m + "ELE" + j) : this.sphereMark.createInstance(m + "ELE" + j);
                    image.setEnabled(false);
                }
                image.position = new BABYLON.Vector3(startPosition.x, startPosition.y, startPosition.z);
                sprites[m][j++] = song.Const.newSprite(image, 0, 0, startPosition, orient, startTime);
            }
        }

        var step = song.Const.solution / (this.T * song.Const.fps);
        this.spriteManager = new song.sprite.Sprite3DManager(sprites, planes, buf, step, this.space);
        //this.spriteManager.update();

    }

    Song3D.prototype.setCamera=function(isFreeCam){
        this.scene.activeCamera=isFreeCam ? this.camera : this.cameraArc;
    }

    Song3D.prototype.reset = function () {
        this.spriteManager.reset();
    }

    Song3D.prototype.run = function () {
        this.spriteManager.update();
        this.spriteManager.time++;
        return (this.spriteManager.time <= this.snap);
    }
    Song3D.prototype.update = function () {
        //do nothing
    }
    Song3D.prototype.getA = function () {
        return this.A;
    }
    Song3D.prototype.getT = function () {
        return this.T;
    }
    Song3D.prototype.getV = function () {
        return this.V;
    }
    Song3D.prototype.getFi = function () {
        return this.Fi;
    }

    Song3D.prototype.setFi = function (fi) {
        this.Fi = fi;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer[i] = (this.A * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
    }
    Song3D.prototype.setA = function (a) {
        this.A = a;
        for (var i = 0; i < song.Const.solution; i++)
            this.spriteManager.posBuffer[i] = (this.A * Math.sin((2 * Math.PI * i) / song.Const.solution + this.Fi));
    }
    Song3D.prototype.setT = function (t) {
        this.T = t;
        this.spriteManager.step = song.Const.solution / (this.T * song.Const.fps);
    }
    Song3D.prototype.setV = function (v) {
        this.V = v;
        var x = 0;
        for (var i = 0; i < this.maxX; i++) {
            x = i - this.maxX2;
            this.spriteManager.sprites[i].startTime = this.density * Math.abs(x - this.xn) * song.Const.fps / this.V;
        }
    }

    Song3D.prototype.setSrc = function (xs, zs, ys) {
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
        //this.update();
    }

    Song3D.prototype.getSrc = function () {
        return this.xn;
    }

    Song3D.prototype.setDensity = function (d) {
        this.density = d;
        var x = 0;
        for (var i = 0; i < this.maxX; i++) {
            x = i - this.maxX2;
            this.spriteManager.sprites[i].startPosition = {
                x: Math.round(this.density * x ) + this.centerX,
                y: this.centerY
            };
            this.spriteManager.sprites[i].startTime = this.density * Math.abs(x - this.xn) * song.Const.fps / this.V;
        }
        this.spriteManager.reset();
        //this.update();
    }

    Song3D.prototype.getDensity = function () {
        return this.density;
    }

    Song3D.prototype.mark = function (img, xm, zm, ym) {
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

    Song3D.prototype.show = function (flag, val) {
        switch (flag) {
            case 1: this.spriteManager.planes[1].setEnabled(true); break;
            case -1: this.spriteManager.planes[1].setEnabled(false); break;
            case 2: this.spriteManager.planes[2].setEnabled(true); break;
            case -2: this.spriteManager.planes[2].setEnabled(false); break;
            case 3: if (this.spriteManager.planes[3]) this.spriteManager.planes[3].setEnabled(true); break;
            case -3: if (this.spriteManager.planes[3]) this.spriteManager.planes[3].setEnabled(false); break;

            case 4: for (var m = 0; m < this.spriteManager.planes.length; m++) this.spriteManager.planes[m].material.wireframe = true; break;
            case -4: for (var m = 0; m < this.spriteManager.planes.length; m++) this.spriteManager.planes[m].material.wireframe = false; break;
            case 5: this.coordX.setEnabled(true); this.coordY.setEnabled(true); this.coordZ.setEnabled(true); break;
            case -5: this.coordX.setEnabled(false); this.coordY.setEnabled(false); this.coordZ.setEnabled(false); break;
            case 6: for (var m = 0; m < this.spriteManager.planes.length; m++) if (this.spriteManager.planes[m].isEnabled()) for (var i = 0; i < this.spriteManager.sprites[m].length; i++) this.spriteManager.sprites[m][i].image.setEnabled(true); break;
            case -6: for (var m = 0; m < this.spriteManager.planes.length; m++) for (var i = 0; i < this.spriteManager.sprites[m].length; i++) this.spriteManager.sprites[m][i].image.setEnabled(false); break;
            case 7: this.spriteManager.planes[0].setEnabled(false); break;
            case -7: this.spriteManager.planes[0].setEnabled(true); break;
        }
        //this.update();
    }

    Song3D.prototype.setSnap = function (t) {
        this.snap = t * song.Const.fps;
    }

    Song3D.prototype.getSnap = function () {
        return this.snap / song.Const.fps;
    }

    Song3D.prototype.getOrient = function () {
        return this.orient;
    }

    Song3D.prototype.setOrient = function (orient) {
        this.orient = orient;
        var s;
        for (var i = 0; i < this.spriteManager.sprites.length; i++) {
            s = this.spriteManager.sprites[i];
            s.orientVectorX = this.orient.x;
            s.orientVectorY = this.orient.y;
        }
    }

    return Song3D;
} ();                                                                                                                                //end class Song3D
/////////////////////////////////////////////////