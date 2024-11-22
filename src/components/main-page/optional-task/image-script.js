const canvas = document.getElementById("myCanvas"), ctx = canvas.getContext('2d');
let w = canvas.width, h = canvas.height;
const hatchWidth = 20 / 2;
const hatchGap = 56;
let currentRadius;

let sections = [
    {
        name: 'first_quarter',
        draw: () => {
            ctx.beginPath();
            ctx.fillStyle = "#0B04D5";
            ctx.moveTo(w/2,h/2 - hatchGap * 2);
            ctx.lineTo(w/2+hatchGap,h/2-hatchGap*2);
            ctx.lineTo(w/2+hatchGap,h/2);
            ctx.lineTo(w/2,h/2);

            ctx.fill();
            ctx.stroke();
        }
    },
    {
        name: "second_quarter",
        draw: () => {
            ctx.beginPath();
            ctx.fillStyle = "#0B04D5";

            ctx.moveTo(w/2,h/2-hatchGap);
            ctx.lineTo(w/2-hatchGap,h/2);
            ctx.lineTo(w/2,h/2);

            ctx.fill();
            ctx.stroke();
        }
    },
    {
        name: "third_quarter",
        draw: () => {
            ctx.beginPath()
            ctx.fillStyle = "#0B04D5"

            ctx.moveTo(w/2,h/2);
            ctx.arc(w/2,h/2,hatchGap*2,Math.PI,Math.PI/2,true);

            ctx.fill();
            ctx.stroke();
        }
    }
];
function redrawGraph() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    for (const section of sections) {
        section.draw();
    }
    drawAxesAndHatch();
    numCoord();
}
function setRadiusByCheckBox(checkbox,newRadius) {
    currentRadius = newRadius;
    redrawGraph();
    // drawAllPointsFromResultTable();
}
function setRadius(newRadius) {
    currentRadius = newRadius;
    redrawGraph();
}
function drawAxesAndHatch() {
    // y ось
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2 - 10, 15);
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2 + 10, 15);
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    ctx.closePath();

    // x ось
    ctx.beginPath();
    ctx.moveTo(w, h / 2);
    ctx.lineTo(w - 15, h / 2 - 10);
    ctx.moveTo(w, h / 2);
    ctx.lineTo(w - 15, h / 2 + 10);
    ctx.moveTo(w, h / 2);
    ctx.lineTo(0, h / 2);
    ctx.stroke();
    ctx.closePath();

    //штрихи
    ctx.beginPath();
    ctx.moveTo(w / 2 - hatchWidth, h / 2 - hatchGap);
    ctx.lineTo(w / 2 + hatchWidth, h / 2 - hatchGap);
    ctx.moveTo(w / 2 - hatchWidth, h / 2 - hatchGap * 2);
    ctx.lineTo(w / 2 + hatchWidth, h / 2 - hatchGap * 2);
    ctx.moveTo(w / 2 - hatchWidth, h / 2 + hatchGap);
    ctx.lineTo(w / 2 + hatchWidth, h / 2 + hatchGap);
    ctx.moveTo(w / 2 - hatchWidth, h / 2 + hatchGap * 2);
    ctx.lineTo(w / 2 + hatchWidth, h / 2 + hatchGap * 2);
    ctx.moveTo(w / 2 - hatchGap, h / 2 - hatchWidth);
    ctx.lineTo(w / 2 - hatchGap, h / 2 + hatchWidth);
    ctx.moveTo(w / 2 - hatchGap * 2, h / 2 - hatchWidth);
    ctx.lineTo(w / 2 - hatchGap * 2, h / 2 + hatchWidth);
    ctx.moveTo(w / 2 + hatchGap, h / 2 - hatchWidth);
    ctx.lineTo(w / 2 + hatchGap, h / 2 + hatchWidth);
    ctx.moveTo(w / 2 + hatchGap * 2, h / 2 - hatchWidth);
    ctx.lineTo(w / 2 + hatchGap * 2, h / 2 + hatchWidth);
    ctx.stroke();
    ctx.closePath();
}

/*Ставит числа рядом со штрихами в соответствии с выбранным R*/
function numCoord(){
    if(currentRadius === null)
        return;
    ctx.font = "20px Segue UI";
    ctx.fillStyle = "black";
    const indent = 20;
    //ось x, положительная часть
    ctx.fillText(`${currentRadius/2}`, w/2+hatchGap,h/2+indent);
    ctx.fillText(`${currentRadius}`, w/2+hatchGap*2,h/2+indent);

    //ось x, отрицательная часть
    ctx.fillText(`${-currentRadius/2}`, w/2-hatchGap,h/2+indent);
    ctx.fillText(`${-currentRadius}`, w/2-hatchGap*2,h/2+indent);

    //ось y, положительная часть
    ctx.fillText(`${currentRadius/2}`, w/2+indent,h/2-hatchGap);
    ctx.fillText(`${currentRadius}`, w/2+indent,h/2-hatchGap*2);

    //ось y, отрицательная часть
    ctx.fillText(`${currentRadius/2}`, w/2+indent,h/2+hatchGap);
    ctx.fillText(`${currentRadius}`, w/2+indent,h/2+hatchGap*2);
}

function printDotOnGraph(xCenter, yCenter, isHit) {
    if(isHit !== null)
        ctx.fillStyle = isHit ? '#1AFF00' : '#ff0000'
    else
        ctx.fillStyle = '#eaca07'
    let x = w / 2 + xCenter * hatchGap * (2 / currentRadius);
    let y = h / 2 - yCenter * hatchGap * (2 / currentRadius);

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.closePath();
    // redrawGraph();
}
redrawGraph();

const mouse = {
    x: 0,
    y: 0
}