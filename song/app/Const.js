//file const.js

/////////////////////////////////////////////////
var song;
if(!song)song={};

/////////////////////////////////////////////////

song.Const = {//chứa các hằng sử dụng chung cho toàn chương trình

    fps: 25, //frame per sec - số khung hình trên giây
    delay: 1000 / 25, ///fps,//độ trễ giữa hai khung hình liên tiếp
    solution: 360, //số lượng tử trong một chu kì
    colors: 11, //số màu biểu diễn pha
    newSprite: function (img, width, height, pos, orient, startTime, orient2, startTime2) {
        return {
            image: img, //hình ảnh của con rối
            width2: Math.round(width / 2),
            height2: Math.round(height / 2),
            position: pos, //vị trí hiện tại của con rối
            position1: { x: pos.x, y: pos.y, z: pos.z },
            position2: { x: pos.x, y: pos.y, z: pos.z },
            startPosition: {//vị trí khởi đầu của con rối
                x: pos.x,
                y: pos.y,
                z:pos.z
            },
            orientVectorX: orient ? orient.x : null, //vector chỉ chiều dao động của con rối
            orientVectorY: orient ? orient.y : null,
            orientVectorZ: orient ? orient.z : null,
            startTime: startTime, //thời điểm bắt đầu hoạt động của con rối
            delta: -1,
            orientVectorX2: orient2 ? orient2.x : null, //vector chỉ chiều dao động của con rối
            orientVectorY2: orient2 ? orient2.y : null,
            orientVectorZ2: orient2 ? orient2.z : null,
            startTime2: startTime2, //thời điểm bắt đầu hoạt động của con rối
            delta2: -1
        }
    }

}//end class Const

/////////////////////////////////////////////////
//end file const.js
