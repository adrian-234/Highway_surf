var jatekter = document.getElementById("canvas");
var ctx = jatekter.getContext("2d");
const canvaswidth = document.getElementById("canvas").offsetWidth
const canvasheigth = document.getElementById("canvas").offsetHeight;
const carwidth = canvaswidth * 0.216;
const carheigth = canvasheigth * 0.225;
var kordX = (canvaswidth - carwidth) / 2;
var kordY = canvasheigth - carheigth - 10;
var akadX = [];
var akadY = [];
var hatterY = canvasheigth * (-1);
var mozgatTO;
var running;

ctx.drawImage(document.getElementById("ut"), 0, hatterY, canvaswidth, canvasheigth * 2);        //csak hogy szép legyen
ctx.drawImage(document.getElementById("maincar"), kordX, kordY, carwidth, carheigth);

function rajzol() {                         //kirajzolja azt ami a canvasban van
    ctx.clearRect(0,0,canvaswidth,canvasheigth);
    ctx.drawImage(document.getElementById("ut"), 0, hatterY, canvaswidth, canvasheigth * 2);
    ctx.drawImage(document.getElementById("maincar"), kordX, kordY, carwidth, carheigth);
    for (let i = 0; i < akadX.length; i++) {
        ctx.drawImage(document.getElementById("akadaly"),akadX[i],akadY[i],carwidth,carheigth)
    }
    if (akadX.length >= 1) { 
        mozgatTO = setTimeout(mozgat, 25);
    }
    utkozes();
}

function utkozes() {        //lehet még finomítani a meghívásán
    for (let i = 0; i < akadX.length; i++) {
        if (akadX[i] == kordX) {
            if (akadY[i] + carheigth >= kordY && akadY[i]<= kordY || akadY[i] + carheigth >= kordY + carheigth && akadY[i]<= kordY + carheigth) {
                stop()
            }
        }
    }
}

var oszlop
var ujelemTO
function ujelem() {
    if (akadY[akadY.length - 1] >= carheigth + 40 && akadX.length <= 4 || akadX.length == 0) {             //meg nézi hogy elfér-e egy új elem és kevesebb mint 4 elem van lent és ha igen akkor hozzá add egy új elemet  
        oszlop = Math.floor(Math.random() * 3) + 1;
        if (oszlop == 1) {
            akadX.push((canvaswidth - carwidth) / 2 - canvaswidth / 3);
            akadY.push(0 - carheigth);
        } if (oszlop == 2) {
            akadX.push((canvaswidth - carwidth) / 2);
            akadY.push(0 - carheigth);
        } if (oszlop == 3) {
            akadX.push((canvaswidth - carwidth) / 2 + canvaswidth / 3);
            akadY.push(0 - carheigth);
        }
    }
}

var sebesseg = 3;
function mozgat() {
    for (let i = 0; i < akadX.length; i++) {
        akadY[i] = akadY[i] + sebesseg;
    }
    if (akadY[0] >= canvasheigth) {
        akadY.shift();
        akadX.shift();
    }
    hatterY += sebesseg;
    if (hatterY > 0) {
        hatterY = canvasheigth * (-1);
    }
    ujelem();
    rajzol();          
}

function stop() {
    clearTimeout(ujelemTO);
    clearTimeout(mozgatTO);
    clearTimeout(pontTO);
    akadX = [];
    akadY = [];
    kordX = (canvaswidth - carwidth) / 2;
    kordY = canvasheigth - carheigth - 10;
    hatterY = canvasheigth * (-1)
    sebesseg = 3;
    elozmenyek.push(document.getElementById("pontok").innerHTML.slice(6));          //elteszi az elért pontot
    if (Number(document.getElementById("pontok").innerHTML.slice(6)) > Number(document.getElementById("rekord").innerHTML.slice(8))) {          //rekord
        document.getElementById("rekord").innerHTML = "Rekord: " + document.getElementById("pontok").innerHTML.slice(6);
    }
    document.getElementById("pontok").innerHTML = "Pont: 0";
    document.getElementById("kiiras").innerHTML = elozmenyek;
    alert("Vége a játéknak!")
    rajzol();
    running = false;
    document.getElementById("start").innerHTML = "Start";
}

var kanyarto;
function balra() {                          //balra kanyar
    if (running == true) {
        document.getElementById("kormany").style.backgroundImage = "url('kormany_bal2.png')";
        if (kordX != (canvaswidth - carwidth) / 2 - canvaswidth / 3) {
            kordX -= canvaswidth / 3;
        }
        clearTimeout(mozgatTO);
        rajzol();
        kanyarto = setTimeout(resetkormany,500);
    }
}
function jobbra() {                         //jobbra kanyar
    if (running == true) {
        document.getElementById("kormany").style.backgroundImage = "url('kormany_jobb2.png')";
        if (kordX != (canvaswidth - carwidth) / 2 + canvaswidth / 3) {
            kordX += canvaswidth / 3;
        }
        clearTimeout(mozgatTO);
        rajzol();
        kanyarto = setTimeout(resetkormany,300);
    }
}
function resetkormany() {                   //visszaállítja kormányt eredeti irányba
    document.getElementById("kormany").style.backgroundImage = "url('kormany.png')";
}

var isdown = false;
function elore() {
    if (isdown == true && kordY > 0 && running == true) {
        kordY -= 3;
        document.getElementById("gazpedal").src = "gazpedal_lent.png";
        setTimeout(elore,25);
    } else {
        document.getElementById("gazpedal").src = "gazpedal.png";
    }
}
function hatra() {
    if (isdown == true && kordY + carheigth < canvasheigth && running == true) {
        kordY += 3;
        document.getElementById("fekpedal").src = "fekpedal_lent.png";
        setTimeout(hatra,25);
    } else {
        document.getElementById("fekpedal").src = "fekpedal.png";
    }
}

var pontTO;
var elozmenyek = []; 
function pont() {
    document.getElementById("pontok").innerHTML = "Pont: " + (Number(document.getElementById("pontok").innerHTML.slice(6)) + 1);
    sebesseg += 0.02;
    pontTO = setTimeout(pont,500);
}

document.getElementById("history_ki").style.display = "none";           //nem kérdez, kell
function elozmeny() {
    if (document.getElementById("history_ki").style.display == "none") {
        document.getElementById("history_ki").style.display = "block";
        document.getElementById("history_ki").style.animationName = "smalltobig";
    }else {
        document.getElementById("history_ki").style.animationName = "bigtosmall";
        setTimeout(display_none,900);
    }
}

function display_none() {       //itt sem kérdez nincs jobb ötletem
    document.getElementById("history_ki").style.display = "none";
}

function start_gomb() {
    if (document.getElementById("start").innerHTML == "Start") {
        running = true;
        ujelem();
        rajzol();
        pont();
        document.getElementById("start").innerHTML = "Stop";
    } else {
        stop()
    }
}

function bill_eloszto(event) {
    if (event.code == "KeyA") {
        balra();
    } if (event.code == "KeyD") {
        jobbra();
    } if (event.code == "KeyW" && isdown == false) {
        isdown = true;
        elore();
    } if (event.code == "KeyS" && isdown == false) {
        isdown = true;
        hatra();
    }
}
function bill_eloszto_stop(event) {
    if (event.code == "KeyW") {
        isdown = false;
        elore();
    } if (event.code == "KeyS") {
        isdown = false;
        hatra();
    }
}
