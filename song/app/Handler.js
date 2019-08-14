var MIN_A = 0.1, MAX_A = 10, STEP_A = 0.1;
var MIN_F = 0.1, MAX_F = 10, STEP_F = 0.2;
var MIN_L = 0.1, MAX_L = 100, STEP_L = 0.5;
var MIN_FI = -360, MAX_FI = 360, STEP_FI = 10;

var MIN_X = -100, MAX_X = 100, STEP_Xn = 1;
var MIN_D = -100, MAX_D = 100, STEP_Dx = 0.1;
var MIN_SNAP = 0.1, MAX_SNAP = 9999, STEP_SNAP = 1;
var SHOW_1 = 1, SHOW_2 = 2, SHOW_3 = 3, SHOW_LINE = 4, SHOW_ORDINATE = 5, SHOW_ELEMENT=6, SHOW_MARK=7;

var NOTHING = 39000;
///////////////////
function cmdBatDau_click() {
    start();
    cmdBatDau.disabled = true;
    cmdTamDung.disabled = false;
    cmdKetThuc.disabled = false;
}
function cmdTamDung_click() {
    pause();
}
function cmdKetThuc_click() {
    stop();
    cmdBatDau.disabled = false;
    cmdTamDung.disabled = true;
    cmdKetThuc.disabled = true;
}

///////////////////
function txtXn_change() {
    aniSong.setSrc(txtXn.value / txtD.value,0,0);
}

function txtD_change() {
    aniSong.setDensity(txtD.value);
}

function txtA_change() {
    aniSong.setA(txtA.value);
    if(aniSong.isStand)
        aniSong.setA2(txtA.value);
}

function txtF_change() {
    aniSong.setT(1 / txtF.value);
    aniSong.setV(txtL.value * txtF.value);
    if (aniSong.isStand)
        aniSong.standing();
}

function txtL_change() {
    aniSong.setV(txtL.value * txtF.value);
    if (aniSong.isStand)
        aniSong.standing();
}

function txtFi_change() {
    aniSong.setFi(txtFi.value * Math.PI / 180);
    if (aniSong.isStand)
        aniSong.standing();
}

function txtSnap_change() {
    aniSong.setSnap(txtSnap.value);
}
///////////////////

function radDim_click(dim, isWater, isGiaoThoa) {
    params.dimension=dim;
    params.isWater=isWater;
    if (isWater) {
        params.dv= 6;
        params.space= 1;
        params.maxY= 0;
        params.maxX= 40;
        params.maxZ= (dim==2)?40:10;
    } else {
        params.dv = 10;
        params.space = 8;
        if (dim == 3) {
            params.maxY = 8;
            params.maxX = isGiaoThoa?16: 8;
            params.maxZ = 8;
        } else if (dim == 2) {
            params.maxY = 0;
            params.maxX = 16;
            params.maxZ = 16;
        } else if (dim == 1) {
            params.maxY = 8;
            params.maxX = 24;
            params.maxZ = 8;
        }
    }
    aniSong.init(params);
    aniSong.update();
}

function radOrient_click(isSongNgang) {
    if (isSongNgang) {
        aniSong.setOrient({ x: 0, y: -1 });
    } else {
    aniSong.setOrient({ x: 1, y: 0 });
    }
}

function chkShow_click(show, check, val) {
    if (check)
        aniSong.show(show, val);
    else
        aniSong.show(-show, val);
}

function txtMarkX_change() {
    aniSong.show(-SHOW_1, txtMarkX.oldVal);
    aniSong.show(SHOW_1, txtMarkX.value);
    txtMarkX.oldVal = txtMarkX.value;
}

function txtMarkZ_change() {
    aniSong.show(-SHOW_2, txtMarkZ.oldVal);
    aniSong.show(SHOW_2, txtMarkZ.value);
    txtMarkZ.oldVal = txtMarkZ.value;
}

function txtMarkY_change() {
    aniSong.show(-SHOW_3, txtMarkY.oldVal);
    aniSong.show(SHOW_3, txtMarkY.value);
    txtMarkY.oldVal = txtMarkY.value;
}
/////////////////////////////////////
var startTime;
var isLiving=false;
var isRunning=false;

function start() {
    startTime = performance.now();
    if(!aniSong.scene)requestAnimationFrame(run);
    isLiving = true;
    isRunning = true;
}

function stop() {
    isLiving = false;
    isRunning = false;
    aniSong.reset();
}

function pause() {
    isRunning = !isRunning;
    if (isRunning)
        if (!aniSong.scene) requestAnimationFrame(run);
}

function run(time) {
    if (time - startTime > song.Const.delay) {
        startTime = time;
        isLiving = aniSong.run();
    }
    if (isRunning && isLiving)
        if (!aniSong.scene) requestAnimationFrame(run);
}