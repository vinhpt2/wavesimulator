///////////////////
function chkStand_click() {
    aniSong.isStand=chkStand.checked;
    aniSong.isFix=radFix.checked;
    aniSong.standing();
}
function radOrient2_click(orient) {
    switch (orient) {
        case 1: //song ngang-ngang
            aniSong.setOrient({ x: 0, y: -1 });
            aniSong.setOrient2({ x: 0, y: -1 });
            break;
        case 2: //song doc-doc
            aniSong.setOrient({ x: 1, y: 0 });
            aniSong.setOrient2({ x: 1, y: 0 });
            break;
        case 3: //song ngang-doc
            aniSong.setOrient({ x: 0, y: -1 });
            aniSong.setOrient2({ x: 1, y: 0 });
            break;
    }
}
///////////////////
function txtXn2_change() {
    aniSong.setSrc2(txtXn2.value / txtD.value,0,0);
}

function txtA2_change() {
    aniSong.setA2(txtA2.value);
}

function txtF2_change() {
    aniSong.setT2(1 / txtF2.value);
    aniSong.setV2(txtL2.value * txtF2.value);
}

function txtL2_change() {
    aniSong.setV2(txtL2.value * txtF2.value);
}

function txtFi2_change() {
    aniSong.setFi2(txtFi2.value * Math.PI / 180);
}