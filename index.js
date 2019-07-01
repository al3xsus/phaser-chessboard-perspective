var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    dom: {
        createContainer: true
    },
};

var game = new Phaser.Game(config);
var graphics;
var background;

function preload() {
    this.load.image('background', 'background.jpg');
}

function create() {
    background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background')
        .setDisplaySize(window.innerWidth, window.innerHeight)
        .setAlpha(0.5);


    graphics = this.add.graphics({lineStyle: {width: 2, color: 0x000000}});

    var x1 = game.config.width / 8;
    var x2 = game.config.width - x1;
    var y1 = game.config.height / 4;
    var y2 = game.config.height - y1;

    var x3 = game.config.width / 4;
    var x4 = game.config.width - x3;

    var ADLine = new Phaser.Geom.Line(x1, y2, x2, y2);
    //graphics.strokeLineShape(ADLine);
    var BCLine = new Phaser.Geom.Line(x3, y1, x4, y1);
    //graphics.strokeLineShape(BCLine);
    var ABLine = new Phaser.Geom.Line(x1, y2, x3, y1);
    //graphics.strokeLineShape(ABLine);
    var CDLine = new Phaser.Geom.Line(x4, y1, x2, y2);
    //graphics.strokeLineShape(CDLine);
    var DBLine = new Phaser.Geom.Line(x2, y2, x3, y1);
    //graphics.strokeLineShape(DBLine);
    var ACLine = new Phaser.Geom.Line(x1, y2, x4, y1);
    //graphics.strokeLineShape(ACLine);

    var chessVertStepBig = (x2 - x1) / 8;
    var chessVertStepSmall = (game.config.width - 2 * (x3)) / 8;

    //volume
    var vADLine = new Phaser.Geom.Line(x1 - chessVertStepBig / 5, y2 + 20, x2 + chessVertStepBig / 5, y2 + 20);
    //graphics.strokeLineShape(vADLine);
    var vADLineLow = new Phaser.Geom.Line(x1 - chessVertStepBig / 5, y2 + 40, x2 + chessVertStepBig / 5, y2 + 40);
    graphics.strokeLineShape(vADLineLow);
    var vADLineLowLeft = new Phaser.Geom.Line(x1 - chessVertStepBig / 5, y2 + 20, x1 - chessVertStepBig / 5, y2 + 40);
    graphics.strokeLineShape(vADLineLowLeft);
    var vADLineLowRight = new Phaser.Geom.Line(x2 + chessVertStepBig / 5, y2 + 20, x2 + chessVertStepBig / 5, y2 + 40);
    graphics.strokeLineShape(vADLineLowRight);

    var vABLine = new Phaser.Geom.Line(x1 - chessVertStepBig / 5, y2 + 20, x3 - chessVertStepSmall / 5, y1 - 10);
    //graphics.strokeLineShape(vABLine);
    var vBCLine = new Phaser.Geom.Line(x3 - chessVertStepSmall / 5, y1 - 10, (x4) + chessVertStepSmall / 5, y1 - 10);
    //graphics.strokeLineShape(vBCLine);
    var vCDLine = new Phaser.Geom.Line((x4) + chessVertStepSmall / 5, y1 - 10, x2 + chessVertStepBig / 5, y2 + 20);
    //graphics.strokeLineShape(vCDLine);

    var chessVertLines = [];
    var chessHorLines = [];

    var buffPoint = new Phaser.Geom.Point();
    var buffLine = new Phaser.Geom.Line(0, 0, 0, 0);
    var buffCoord = {};

    for (var i = 0; i < 9; i++) {
        chessVertLines.push(new Phaser.Geom.Line(x3 + chessVertStepSmall * i, y1, x1 + chessVertStepBig * i, y2));
        Phaser.Geom.Intersects.LineToLine(chessVertLines[i], ACLine, buffPoint);
        buffLine = new Phaser.Geom.Line(0, buffPoint.y, game.config.width, buffPoint.y);

        Phaser.Geom.Intersects.LineToLine(buffLine, ABLine, buffPoint);
        buffCoord.x = buffPoint.x;
        buffCoord.y = buffPoint.y;

        Phaser.Geom.Intersects.LineToLine(buffLine, CDLine, buffPoint);
        buffCoord.x1 = buffPoint.x;
        buffCoord.y1 = buffPoint.y;

        chessHorLines.push(new Phaser.Geom.Line(buffCoord.x, buffCoord.y, buffCoord.x1, buffCoord.y1));
        graphics.strokeLineShape(chessVertLines[i]);
        graphics.strokeLineShape(chessHorLines[i]);
    }

    filling(x1, x2, x3, x4, y1, y2, chessVertStepBig, chessVertStepSmall);

    for (var k = 0; k < 8; k++) {
        for (var j = 0; j < 8; j++) {
            if ((k + j) % 2 === 0) graphics.fillStyle(0x111111);
            else graphics.fillStyle(0xDDDDDD);

            graphics.beginPath();

            //1
            if (!Phaser.Geom.Intersects.LineToLine(chessVertLines[j], chessHorLines[k])) {
                graphics.moveTo(chessHorLines[k].x1, chessHorLines[k].y1);
                buffCoord.x1 = chessHorLines[k].x1;
                buffCoord.y1 = chessHorLines[k].y1
            } else {
                Phaser.Geom.Intersects.LineToLine(chessVertLines[j], chessHorLines[k], buffPoint);
                graphics.moveTo(buffPoint.x, buffPoint.y);
                buffCoord.x1 = buffPoint.x;
                buffCoord.y1 = buffPoint.y
            }

            //2
            if (!Phaser.Geom.Intersects.LineToLine(chessVertLines[j], chessHorLines[k + 1])) graphics.lineTo(chessHorLines[k + 1].x1, chessHorLines[k + 1].y1);
            else {
                Phaser.Geom.Intersects.LineToLine(chessVertLines[j], chessHorLines[k + 1], buffPoint);
                graphics.lineTo(buffPoint.x, buffPoint.y)
            }

            //3
            if (!Phaser.Geom.Intersects.LineToLine(chessVertLines[j + 1], chessHorLines[k + 1])) {
                graphics.lineTo(chessHorLines[k + 1].x2, chessHorLines[k + 1].y2);
                buffCoord.x2 = chessHorLines[k + 1].x2;
                buffCoord.y2 = chessHorLines[k + 1].y2
            } else {
                Phaser.Geom.Intersects.LineToLine(chessVertLines[j + 1], chessHorLines[k + 1], buffPoint);
                graphics.lineTo(buffPoint.x, buffPoint.y);
                buffCoord.x2 = buffPoint.x;
                buffCoord.y2 = buffPoint.y
            }

            //4
            if (!Phaser.Geom.Intersects.LineToLine(chessVertLines[j + 1], chessHorLines[k])) graphics.lineTo(chessHorLines[k].x2, chessHorLines[k].y2);
            else {
                Phaser.Geom.Intersects.LineToLine(chessVertLines[j + 1], chessHorLines[k], buffPoint);
                graphics.lineTo(buffPoint.x, buffPoint.y)
            }

            //5
            if (!Phaser.Geom.Intersects.LineToLine(chessVertLines[j], chessHorLines[k])) graphics.lineTo(chessHorLines[k].x1, chessHorLines[k].y1);
            else {
                Phaser.Geom.Intersects.LineToLine(chessVertLines[j], chessHorLines[k], buffPoint);
                graphics.lineTo(buffPoint.x, buffPoint.y)
            }

            graphics.closePath();
            graphics.strokePath();
            graphics.fillPath();

            buffCoord.x = (buffCoord.x2 - buffCoord.x1) / 2 + buffCoord.x1;
            buffCoord.y = buffCoord.y1 - (buffCoord.y1 - buffCoord.y2) / 2;

            graphics.fillStyle(0xFF4136);

            graphics.fillCircleShape(new Phaser.Geom.Circle(buffCoord.x, buffCoord.y, 5));
        }
    }

}

function update() {
}

function filling(x1, x2, x3, x4, y1, y2, chessVertStepBig, chessVertStepSmall) {

    //fill lower part
    graphics.fillStyle(0x5F3E00);
    graphics.fillRect(x1 - chessVertStepBig / 5, y2 + 20, (x2 + chessVertStepBig / 5) - (x1 - chessVertStepBig / 5), 20);

    //fill lower-upper part
    auxFillVol([x1, y2, x1 - chessVertStepBig / 5, y2 + 20, x2 + chessVertStepBig / 5, y2 + 20, x2, y2]);

    //fill left part
    auxFillVol([x1, y2, x3, y1, x3 - chessVertStepSmall / 5, y1 - 10, x1 - chessVertStepBig / 5, y2 + 20]);

    //fill upper part
    auxFillVol([x3, y1, x4, y1, (x4) + chessVertStepSmall / 5, y1 - 10, x3 - chessVertStepSmall / 5, y1 - 10]);

    //fill right part
    auxFillVol([x4, y1, (x4) + chessVertStepSmall / 5, y1 - 10, x2 + chessVertStepBig / 5, y2 + 20, x2, y2])
}

function auxFillVol(points) {
    graphics.beginPath();
    graphics.moveTo(points[0], points[1]);
    graphics.lineTo(points[2], points[3]);
    graphics.lineTo(points[4], points[5]);
    graphics.lineTo(points[6], points[7]);
    graphics.lineTo(points[0], points[1]);
    graphics.closePath();
    graphics.strokePath();
    graphics.fillPath();
}