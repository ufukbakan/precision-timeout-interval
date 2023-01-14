const { prcInterval, prcIntervalWithDelta } = require("./index");
let canvasWidth, canvasHeight;
const hexadecimalChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
let running = true;
const FPS = 144;
let legacyContext, precisionContext, prcDeltaContext, colors;
let legacyPoints, precisionPoints, prcDeltaPoints;
let dummyPingCounter = 0, dummyPingCounter2 = 2, dummyPingCounter3 = 7;
let dummyPingCounter4 = 1000, dummyPingCounter5 = 10002, dummyPingCounter6 = 99;

window.addEventListener("load", ()=>{
    canvasWidth = +document.querySelector("canvas").width;
    canvasHeight = +document.querySelector("canvas").height;
    const canvasL = document.getElementById("legacy-canvas");
    const canvasPrc = document.getElementById("precision-canvas");
    const canvasPrcDelta = document.getElementById("prc-delta-canvas");
    const button = document.getElementById("dummy-button");
    legacyContext = canvasL.getContext("2d");
    precisionContext = canvasPrc.getContext("2d");
    prcDeltaContext = canvasPrcDelta.getContext("2d");
    legacyPoints = [], precisionPoints = [], prcDeltaPoints = [];
    colors = [];
    for(let i = 0; i < canvasHeight; i+=10){
        legacyPoints.push( {x: 0, y: i} );
        precisionPoints.push( {x: 0, y: i} );
        prcDeltaPoints.push( {x: 0, y: i} );
        colors.push(randomColor());
    }
    
    legacyPoints.forEach(point => {
        point.update = window.setInterval( ()=> movePoint(point), 1000 / FPS);
    });

    precisionPoints.forEach(point => {
        point.update = prcInterval( 1000/FPS, (deltaT)=> { movePoint(point, deltaT); } );
    });

    prcDeltaPoints.forEach(point => {
        point.update = prcIntervalWithDelta( 1000/FPS, (deltaT)=> { movePoint(point, deltaT); } );
    });
    
    window.setInterval( ()=> render(legacyContext, legacyPoints, colors), 1000/FPS );
    prcInterval(1000/FPS, ()=>render(precisionContext, precisionPoints, colors) );
    prcInterval(1000/FPS, ()=>render(prcDeltaContext, prcDeltaPoints, colors) );

    initDummyCounters();
    button.addEventListener("click", toggleInterval);
});

function initDummyCounters(){
    window.setInterval( ()=> { dummyPingCounter = (dummyPingCounter+1) % 9999 }, 250 );
    window.setInterval( ()=> { dummyPingCounter2 = (dummyPingCounter2+1) % 9999 }, 250 );
    window.setInterval( ()=> { dummyPingCounter3 = (dummyPingCounter3+1) % 9999 }, 250 );
    prcInterval( 250, ()=> { dummyPingCounter4 = (dummyPingCounter4+1) % 9999 } );
    prcInterval( 250, ()=> { dummyPingCounter5 = (dummyPingCounter5+1) % 9999 } );
    prcInterval( 250, ()=> { dummyPingCounter6 = (dummyPingCounter6+1) % 9999 } );
}

/**
 * @param {CanvasRenderingContext2D} context
 * @param {Array} points
 * @param {Array} colors
 */
function render(context, points, colors=undefined, clear=true){
    if(clear){
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    for(let i = 0; i < points.length; i++){
        if(colors && colors[i]){
            context.fillStyle = colors[i];
        }
        context.fillRect(points[i].x, points[i].y, 10, 10);
    }
}

function movePoint(point, deltaT=10){
    point.x = (point.x + 1*deltaT) % canvasWidth;
    if(point.x == 0){
        point.y = (point.y + 1*deltaT) % canvasHeight;
    }
}

function toggleInterval(){
    if(running){
        legacyPoints.forEach(
            point=>
            window.clearInterval(point.update)
        );
        precisionPoints.forEach(
            point=>
            {point.update.cancel()}
        );
        prcDeltaPoints.forEach(
            point =>
            {point.update.cancel()}
        );
        running = false;
    }else{
        legacyPoints.forEach(point => {
            point.update = window.setInterval( ()=> movePoint(point), 1000 / FPS);
        });

        precisionPoints.forEach(point => {
            point.update = prcInterval( 1000/FPS, ()=> { movePoint(point); } );
        });
    
        prcDeltaPoints.forEach(point => {
            point.update = prcIntervalWithDelta( 1000/FPS, (deltaT)=> { movePoint(point, deltaT); } );
        });
        running = true;
    }
}

function randomColor(){
    let result = "#";
    for(let i = 0; i < 6; i++){
        result += hexadecimalChars[ Math.round( Math.random()*hexadecimalChars.length ) ];
    }
    return result;
}