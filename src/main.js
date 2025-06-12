import { getPlayers, setGameStart, cambioSaque } from "./utils/interact.js";
import { } from "./utils/game.js";

function launch() { //Terminado refactoreo
  console.log("Entre a launch()");
  let { player1, player2, tactic1, tactic2 } = getPlayers();
  //console.log(player1, player2, tactic1, tactic2);
  setGameStart(player1.nomb1, player2.nomb2);
  boostSkills(player1, player2, tactic1, tactic2);

  /* Seteo el saque */
  //let saq = Math.round(Math.random() * 10) + 1;
  //saq = cambioSaque(saq);

  let gameState = {
    play: true,
    punto1: 0,
    punto2: 0,
    game1: 0,
    game2: 0,
    set: 1,
    set1: 0,
    set2: 0,
    auxpunto: 0,
    auxgame: 0,
    tie: 0,
    control: 0,
    auxtie: 0,
    chequeo: 0,
    velocidad: 1000,
    cont: 0,
    ya_lesion: 0,
    pLesion1: 0,
    pLesion2: 0,
    lluvia: 0,
    puntosalto_lluvia: 0,
    tiempo: 0,
    puntosJugados: 0,
    puntoLesion: 999, //no deberia llegar al 999
    saq: Math.round(Math.random() * 10) + 1, //FIXME: x10?
    surface: setSuperficie(),
    numberOfSets: setNumeroSets(),
  };

  setUpButtons(gameState);

  boostSurface(gameState.surface, player1, player2);
  calcularClima(gameState);

  let mensajeExpuesto = false;

  do {
    gameState.pLesion1 = lesionar(player1.form1, player1.sta1);
    gameState.pLesion2 = lesionar(player2.form2, player2.sta2);
  } while (
    gameState.pLesion1 == gameState.pLesion2 &&
    (gameState.pLesion1 <= 40 || gameState.pLesion2 <= 40)
  );

  if (gameState.pLesion1 <= 40 || gameState.pLesion2 <= 40)
    saltarLesion(gameState);

  partido(player1, player2, tactic1, tactic2, gameState);
}

function partido(player1, player2, tactic1, tactic2, gameState) {
  //alert("listo para comenzar el partido");
  //console.log("Entre a partido(): ");
  //console.log(JSON.parse(JSON.stringify(gameState))); //fijo valores
  processInjury(player1, player2, gameState);
  processRain(player1, player2, gameState);
  processTiebreak(player1, player2, gameState);

  //FIXME: si estan en el mismo game randomiza la mano habil ???
  if (gameState.game1 == gameState.game2 && gameState.game1 > 15 && gameState.set != 5) {
    gameState.fore1 = Math.round(Math.random() * 10);
    gameState.fore2 = Math.round(Math.random() * 10);
  }

  //Logica de puntos estandar
  playPoint(player1, player2, tactic1, tactic2, gameState);

  processClock(gameState);
}

function playPoint(player1, player2, tactic1, tactic2, gameState) {  //Terminado refactoreo
  //console.log("Entre a playPoint()");
  //console.log(gameState);
  if (gameState.tie == 0) {
    if (gameState.game1 == gameState.game2 && gameState.game1 >= 5) {
      if (gameState.control == 0) gameState.auxgame++;
      gameState.control = 1;
    }

    /*  ok, pts son las posibilidades de cada uno de ganar el punto,
        en primera instancia eso se calcula con la funcion punto(),
        si eso saliera empatado simplemente lo randomiza
     */
    let pts1 = probs(player1, player2, tactic1, 1, gameState);
    let pts2 = probs(player1, player2, tactic2, 2, gameState);

    //console.log("Probs/ p1: " + pts1 + " p2: " + pts2);

    gameState.puntosJugados++;

    if (pts1 == pts2) {
      pts1 = Math.random(1000);
      pts2 = Math.random(1000);
    }
    if (pts1 <= pts2) gameState.punto2++;
    else gameState.punto1++;


    if (pts1 <= pts2 && gameState.punto1 == 4) {
      gameState.punto1--;
      gameState.punto2--;
    }
    if (pts2 < pts1 && gameState.punto2 == 4) {
      gameState.punto1--;
      gameState.punto2--;
    }

    //console.log("punto1: " + gameState.punto1 + " punto2: " + gameState.punto2);

    //resultado(punto1, punto2, game1, game2);
    if ((gameState.punto1 == gameState.punto2) && (gameState.punto1 == 3))
      gameState.auxpunto = 1;
    if (gameState.punto1 > 3 + gameState.auxpunto) {
      gameState.game1++;
      cambioSaque();
      gameState.control = 0;
      gameState.auxpunto = 0;
      gameState.punto1 = 0;
      gameState.punto2 = 0;
    }
    if (gameState.punto2 > 3 + gameState.auxpunto) {
      gameState.game2++;
      cambioSaque();
      gameState.control = 0;
      gameState.auxpunto = 0;
      gameState.punto1 = 0;
      gameState.punto2 = 0;
    }

    switch (gameState.punto1) {
      case 0:
        document.getElementById("game1").innerHTML = "<font face='helvetica' color='navy'><center>0</center></font>";
        break;
      case 1:
        document.getElementById("game1").innerHTML = "<font face='helvetica' color='navy'><center>15</center></font>";
        break;
      case 2:
        document.getElementById("game1").innerHTML = "<font face='helvetica' color='navy'><center>30</center></font>";
        break;
      case 3:
        document.getElementById("game1").innerHTML = "<font face='helvetica' color='maroon'><center>40</center></font>";
        break;
      case 4:
        document.getElementById("game1").innerHTML = "<font face='helvetica' color='maroon'><center>A</center></font>";
        break;
    }
    switch (gameState.punto2) {
      case 0:
        document.getElementById("game2").innerHTML = "<font face='helvetica' color='navy'><center>0</center></font>";
        break;
      case 1:
        document.getElementById("game2").innerHTML = "<font face='helvetica' color='navy'><center>15</center></font>";
        break;
      case 2:
        document.getElementById("game2").innerHTML = "<font face='helvetica' color='navy'><center>30</center></font>";
        break;
      case 3:
        document.getElementById("game2").innerHTML = "<font face='helvetica' color='maroon'><center>40</center></font>";
        break;
      case 4:
        document.getElementById("game2").innerHTML = "<font face='helvetica' color='maroon'><center>A</center></font>";
        break;
    }

    switch (gameState.set) {
      case 1:
        document.getElementById("set11").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game1 + "</center></font>";
        document.getElementById("set21").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game2 + "</center></font>";
        break;
      case 2:
        document.getElementById("set12").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game1 + "</center></font>";
        document.getElementById("set22").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game2 + "</center></font>";
        break;
      case 3:
        document.getElementById("set13").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game1 + "</center></font>";
        document.getElementById("set23").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game2 + "</center></font>";
        break;
      case 4:
        document.getElementById("set14").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game1 + "</center></font>";
        document.getElementById("set24").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game2 + "</center></font>";
        break;
      case 5:
        document.getElementById("set15").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game1 + "</center></font>";
        document.getElementById("set25").innerHTML = "<font color='#CCFF00' face = 'helvetica'><center>" + gameState.game2 + "</center></font>";
        break;
    }
    //fin vieja funcion resultado

    if (gameState.game1 > 5 + gameState.auxgame) {
      
      gameState.set++;
      gameState.set1++;
      player1.sta1 = player1.sta1 - tactic1.technique1;
      player2.sta2 = player2.sta2 - tactic2.technique2;
      gameState.game1 = 0;
      gameState.game2 = 0;
      gameState.auxgame = 0;
      gameState.control = 0;
    }
    if (gameState.game2 > 5 + gameState.auxgame) {
      gameState.set++;
      gameState.set2++;
      player1.sta1 = player1.sta1 - tactic1.technique1;
      player2.sta2 = player2.sta2 - tactic2.technique2;
      gameState.game1 = 0;
      gameState.game2 = 0;
      gameState.auxgame = 0;
      gameState.control = 0;
    }

    //tiempo = tiempo + Math.floor(Math.random() * 90);

    if (gameState.numberOfSets == 5) { //5 sets
      if (gameState.set1 < 3 && gameState.set2 < 3 && gameState.play) {
        setTimeout(partido, gameState.velocidad, player1, player2, tactic1, tactic2, gameState);
      }
    } //3 sets
    else {
      if (gameState.set1 < 2 && gameState.set2 < 2 && gameState.play) {
        setTimeout(partido, gameState.velocidad, player1, player2, tactic1, tactic2, gameState);
      }
    }

  }

}

function boostSkills(player1, player2, tactic1, tactic2) {  //Terminado refactoreo
  /* Bost de habilidades segun tactica */
  if (tactic1.position1 == 1) {
    player1.drop1++;
    player1.vol1++;
  }
  if (tactic1.position1 == 2) player1.pow1++;
  if (tactic2.position2 == 1) {
    player2.drop2++;
    player2.vol2++;
  }
  if (tactic2.position2 == 2) player2.pow2++;

  /* Bost de habilidades segun tecnica */
  player1.fore1 = player1.fore1 + tactic1.technique1 * 1.5;
  player1.back1 = player1.back1 + tactic1.technique1 * 1.5;
  player2.fore2 = player2.fore2 + tactic2.technique2 * 1.5;
  player2.back2 = player2.back2 + tactic2.technique2 * 1.5;
}

function boostSurface(surface, player1, player2) {  //Terminado refactoreo
  if (surface == player1.surf1) {
    switch (surface) {
      case "clay":
        player1.consi1 = player1.consi1 * 2.5;
        break;
      case "hardcourt":
        player1.consi1 = player1.consi1 * 2;
        break;
      case "carpet":
        player1.consi1 = player1.consi1 * 1.5;
        break;
      case "grass":
        break;
    }
  } else {
    if (player1.surf1 == "neutral") {
      switch (surface) {
        case "clay":
          player1.consi1 = player1.consi1 * 1.75;
          break;
        case "hardcourt":
          player1.consi1 = player1.consi1 * 1.5;
          break;
        case "carpet":
          player1.consi1 = player1.consi1 * 1.25;
          break;
        case "grass":
          break;
      }
    }
  }

  if (surface == player2.surf2) {
    switch (surface) {
      case "clay":
        player2.consi2 = player2.consi2 * 2.5;
        break;
      case "hardcourt":
        player2.consi2 = player2.consi2 * 2;
        break;
      case "carpet":
        player2.consi2 = player2.consi2 * 1.5;
        break;
      case "grass":
        break;
    }
  } else {
    if (player2.surf2 == "neutral") {
      switch (surface) {
        case "clay":
          player2.consi2 = player2.consi2 * 1.75;
          break;
        case "hardcourt":
          player2.consi2 = player2.consi2 * 1.5;
          break;
        case "carpet":
          player2.consi2 = player2.consi2 * 1.25;
          break;
        case "grass":
          break;
      }
    }
  }
}

//FIXME: chequear
function setSuperficie() {
  // for (let i = 0; i < MatchSurface.surface.length; i++) {
  //   if (MatchSurface.surface[i].checked) return MatchSurface.surface[i].value;
  // }
  let s = document.getElementById("surface").options[
      document.getElementById("surface").selectedIndex
    ].value;
  return s;
}

//FIXME: chequear
function setNumeroSets() {
  for (let i = 0; i < setsNumber.setsNum.length; i++) {
    if (setsNumber.setsNum[i].checked) return setsNumber.setsNum[i].value;
  }
}

function calcularClima(gameState) { //Terminado refactoreo
  //Previsiones: Soleado(0-80), Parcialmente nublado(81-90), Nublado(91-96), Posibles Chubascos(97-99), Chubascos(100)
  let rn = Math.round(Math.random() * 100);
  if (rn < 81)
    document.getElementById("prev_tiempo").innerHTML =
      "<img src='./img/tiempo/soleado.svg'></img>";
  if (rn > 80 && rn < 91)
    document.getElementById("prev_tiempo").innerHTML =
      "<img src='./img/tiempo/parcnublado.svg'></img>";
  if (rn > 90 && rn < 97)
    document.getElementById("prev_tiempo").innerHTML =
      "<img src='./img/tiempo/nublado.svg'></img>";
  if (rn > 96 && rn < 100) {
    document.getElementById("prev_tiempo").innerHTML =
      "<img src='./img/tiempo/inestable.svg'></img>";
    let punto_lluvia = Math.round(Math.random() * 100);
    if (punto_lluvia < 81) {
      if (gameState.numberOfSets == 3)
        gameState.puntosalto_lluvia = Math.floor(Math.random() * 299);
      else if (gameState.numberOfSets == 5)
        gameState.puntosalto_lluvia = Math.floor(Math.random() * 499);
      gameState.lluvia = 1;
    }
  }
  if (rn > 99) {
    document.getElementById("prev_tiempo").innerHTML =
      "<img src='./img/tiempo/lluvia.svg'></img>";
    if (gameState.numberOfSets == 3)
      puntosalto_lluvia = Math.floor(Math.random() * 299);
    else if (gameState.numberOfSets == 5)
      puntosalto_lluvia = Math.floor(Math.random() * 499);
    gameState.lluvia = 1;
  }
}

function lesionar(fm, st) {   //Terminado refactoreo
  return Math.floor(Math.random() * 99) + fm * 3 + st;
}

function saltarLesion(gameState) {  //Terminado refactoreo
  if (gameState.numberOfSets == 3)
    gameState.puntoLesion = Math.floor(Math.random() * 299);
  else if (gameState.numberOfSets == 5)
    gameState.puntoLesion = Math.floor(Math.random() * 499);
}

function modificarVelocidad(vel, gameState) {   //Terminado refactoreo
  if (vel == 1 && gameState.velocidad > 100)
    gameState.velocidad = gameState.velocidad * 0.9;
  if (vel == 0 && gameState.velocidad < 1900)
    gameState.velocidad = gameState.velocidad * 1.1;
}

function processInjury(player1, player2, gameState) {   //Terminado refactoreo
  if (
    gameState.pLesion1 <= 40 &&
    gameState.pLesion1 < gameState.pLesion2 &&
    gameState.puntosJugados == gameState.puntoLesion &&
    gameState.ya_lesion == 0
  ) {
    processInjury(gameState.name1, gameState.name2);
    return;
  } else if (
    gameState.pLesion2 <= 40 &&
    gameState.pLesion2 < gameState.pLesion1 &&
    gameState.puntosJugados == gameState.puntoLesion &&
    gameState.ya_lesion == 0
  ) {
    processInjury(gameState.name2, gameState.name1);
    return;
  }
}

function processRain(player1, player2, gameState) {   //Terminado refactoreo
  if (gameState.lluvia == 1) {
    if (gameState.puntosalto_lluvia == gameState.puntosJugados) {
      if (gameState.surface == "clay") {
        player1.consi1 = player1.consi1 - 0.5;
        player2.consi2 = player2.consi2 - 0.5;
        alert("Empieza a llover ligeramente...");
        if (gameState.surface == player1.surf1)
          player1.spe1 = player1.spe1 - 0.5;
        else {
          if (player1.surf1 != "neutral") player1.spe1 = player1.spe1 - 1;
          else player1.spe1 = player1.spe1 - 0.75;
        }

        if (gameState.surface == player2.surf2)
          player2.spe2 = player2.spe2 - 0.5;
        else {
          if (player2.surf2 != "neutral") player2.spe2 = player2.spe2 - 1;
          else player2.spe2 = player2.spe2 - 0.75;
        }
      }
      if (gameState.surface == "grass") {
        player1.consi1 = player1.consi1 - 2;
        player2.consi2 = player2.consi2 - 2;
        alert("Empieza a llover ligeramente...");
        if (gameState.surface == player1.surf1) player1.spe1 = player1.spe1 - 1;
        else {
          if (player1.surf1 != "neutral") player1.spe1 = player1.spe1 - 1.5;
          else player1.spe1 = player1.spe1 - 1.25;
        }

        if (gameState.surface == player2.surf2) player2.spe2 = player2.spe2 - 1;
        else {
          if (player2.surf2 != "neutral") player2.spe2 = player2.spe2 - 1.5;
          else player2.spe2 = player2.spe2 - 1.25;
        }
      }
      if (gameState.surface == "hardcourt") {
        player1.consi1 = player1.consi1 - 1.5;
        player2.consi2 = player2.consi2 - 1.5;
        alert("Empieza a llover ligeramente...");
        if (gameState.surface == player1.surf1) splayer1.pe1 = spe1 - 0.75;
        else {
          if (player1.surf1 != "neutral") player1.spe1 = player1.spe1 - 1.25;
          else player1.spe1 = player1.spe1 - 1;
        }

        if (gameState.surface == player2.surf2)
          player2.spe2 = player2.spe2 - 0.75;
        else {
          if (player2.surf2 != "neutral") player2.spe2 = player2.spe2 - 1.25;
          else player2.spe2 = player2.spe2 - 1;
        }
      }
      if (gameState.surface == "carpet") {
      }
    }
  }
}

function processTiebreak(player1, player2, gameState) {   //Terminado refactoreo
  if (
    gameState.game1 == gameState.game2 &&
    gameState.game1 == 6 &&
    gameState.set != 5
  ) {
    gameState.tie = 1;
    gameState.punto1 = 0;
    gameState.punto2 = 0;
    gameState.game1 = 0;
    gameState.game2 = 0;

    setTimeout(tiebreak, velocidad, player1, player2, gameState);
  }
}


//TODO: seguir adaptando
function tiebreak(player1, player2, gameState) {
  //console.log("Entre a tiebreak()");
  processInjury(player1, player2, gameState);
  processRain(player1, player2, gameState);

  //TODO: seguir adaptando desde aca
  cont++;
  if (cont == 1 || cont % 2 == 0) setTimeout("cambio(),50");

  if (punto1 == punto2 && punto1 == 6 + auxtie) auxtie++;

  pts1 = punto(
    fore1,
    back1,
    vol1,
    drop1,
    spe1,
    sta1,
    ser1,
    pow1,
    rest1,
    form1,
    1,
    saq,
    consi1
  );
  pts2 = punto(
    fore2,
    back2,
    vol2,
    drop2,
    spe2,
    sta2,
    ser2,
    pow2,
    rest2,
    form2,
    2,
    saq,
    consi2
  );

  puntosJugados++;

  if (pts1 == pts2) {
    pts1 = Math.random(1000);
    pts2 = Math.random(1000);
  }

  if (pts1 <= pts2) punto2++;
  else punto1++;

  document.getElementById("tie").innerHTML =
    "<font  color='black'><b><center>Tie Break</center></b></font>";
  document.getElementById("game1").innerHTML =
    "<font face='helvetica' color='olive'><center>" +
    punto1 +
    "</center></font>";
  document.getElementById("game2").innerHTML =
    "<font face='helvetica' color='olive'><center>" +
    punto2 +
    "</center></font>";

  //tiempo = tiempo + Math.floor(Math.random() * 90);
  processClock(gameState);

  if (punto1 < 7 + auxtie && punto2 < 7 + auxtie)
    setTimeout(
      "tiebreak(fore1,back1,vol1,drop1,spe1,sta1,ser1,pow1,rest1,form1,fore2,back2,vol2,drop2,spe2,sta2,ser2,pow2,rest2,form2,punto1,punto2,game1,game2,set1,set2,consi1,consi2)",
      velocidad
    );

  if (punto1 > 6 + auxtie) {
    switch (set) {
      case 1:
        document.getElementById("set11").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set21").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
      case 2:
        document.getElementById("set12").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set22").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
      case 3:
        document.getElementById("set13").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set23").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
      case 4:
        document.getElementById("set14").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set24").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
      case 5:
        document.getElementById("set15").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set25").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
    }
    cambio();
    cont = 0;
    auxtie = 0;
    set1++;
    set++;
    sta1 = sta1 - technique1;
    sta2 = sta2 - technique2;
    auxgame = 0;
    tie = 0;
    cero();
    if (numberOfSets == 5) {
      if (set1 < 3 && set2 < 3)
        setTimeout(
          "partido(fore1,back1,vol1,drop1,spe1,sta1,ser1,pow1,rest1,form1,fore2,back2,vol2,drop2,spe2,sta2,ser2,pow2,rest2,form2,punto1,punto2,game1,game2,set1,set2,control,consi1,consi2)",
          velocidad
        );
    } //3 sets
    else {
      if (set1 < 2 && set2 < 2)
        setTimeout(
          "partido(fore1,back1,vol1,drop1,spe1,sta1,ser1,pow1,rest1,form1,fore2,back2,vol2,drop2,spe2,sta2,ser2,pow2,rest2,form2,punto1,punto2,game1,game2,set1,set2,control,consi1,consi2)",
          velocidad
        );
    }
  }

  if (punto2 > 6 + auxtie) {
    switch (set) {
      case 1:
        document.getElementById("set11").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set21").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
      case 2:
        document.getElementById("set12").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set22").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
      case 3:
        document.getElementById("set13").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set23").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
      case 4:
        document.getElementById("set14").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set24").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
      case 5:
        document.getElementById("set15").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>6<sup>" +
          punto1 +
          "</sup></center></font>";
        document.getElementById("set25").innerHTML =
          "<font color ='#CCFF00' face='helvetica'><center>7<sup>" +
          punto2 +
          "</sup></center></font>";
        break;
    }
    cambio();
    cont = 0;
    auxtie = 0;
    set2++;
    set++;
    sta1 = sta1 - technique1;
    sta2 = sta2 - technique2;
    auxgame = 0;
    tie = 0;
    cero();
    if (numberOfSets == 5) {
      if (set1 < 3 && set2 < 3)
        setTimeout(
          "partido(fore1,back1,vol1,drop1,spe1,sta1,ser1,pow1,rest1,form1,fore2,back2,vol2,drop2,spe2,sta2,ser2,pow2,rest2,form2,punto1,punto2,game1,game2,set1,set2,control,consi1,consi2)",
          velocidad
        );
    } //3 sets
    else {
      if (set1 < 2 && set2 < 2)
        setTimeout(
          "partido(fore1,back1,vol1,drop1,spe1,sta1,ser1,pow1,rest1,form1,fore2,back2,vol2,drop2,spe2,sta2,ser2,pow2,rest2,form2,punto1,punto2,game1,game2,set1,set2,control,consi1,consi2)",
          velocidad
        );
    }
  }
}

function probs(player1, player2, tactic, jug, gameState) { // listo?
  //console.log("Entre a probs()");
  let sup = 0;  //base de las probs ?
  let rand = 0;
  let p = {
      fo: 0,
      ba: 0,
      vo: 0,
      dr: 0,
      sp: 0,
      st: 0,
      se: 0,
      po: 0,
      rest: 0,
      form: 0,
      co: 0,
      surf: 0,
    }

  if (jug == 1) {
    p.fo = player1.fore1;
    p.ba = player1.back1;
    p.vo = player1.vol1;
    p.dr = player1.drop1;
    p.sp = player1.spe1;
    p.st = player1.sta1;
    p.se = player1.ser1;
    p.po = player1.pow1;
    p.rest = player1.rest1;
    p.form = player1.form1;
    p.co = player1.consi1;
    p.surf = player1.surf1;

    if (player1.surf1 == gameState.surface) sup = sup + 5;
    else if (player1.surf1 == "neutral") sup = sup + 2.5;
    if (tactic.strategy1 == 1) sup = sup - player2.fore2;
    if (tactic.strategy1 == 2) sup = sup - player2.back2;
    if (gameState.saq == 1) calcular(1, tactic.first1, tactic.second1, 1, player1, { sup }, gameState.surface);
  }

  if (jug == 2) {
    p.fo = player2.fore2;
    p.ba = player2.back2;
    p.vo = player2.vol2;
    p.dr = player2.drop2;
    p.sp = player2.spe2;
    p.st = player2.sta2;
    p.se = player2.ser2;
    p.po = player2.pow2;
    p.rest = player2.rest2;
    p.form = player2.form2;
    p.co = player2.consi2;
    p.surf = player2.surf2;

    if (player2.surf2 == gameState.surface) sup = sup + 5;
    else if (player2.surf2 == "neutral") sup = sup + 2.5;
    if (tactic.strategy2 == 1) sup = sup - player1.fore1;
    if (tactic.strategy2 == 2) sup = sup - player1.back1;
    if (gameState.saq == 2) calcular(2, tactic.first2, tactic.second2, 1, player2, { sup }, gameState.surface);
  }
  
  //console.log("p:", JSON.parse(JSON.stringify(p)));

  if (gameState.surface == "clay")
    rand = p.fo * 1.5 + p.ba * 1.5 + p.vo * 0.65 + p.dr * 1.5 + p.sp * 1.9 + p.st * 1.7 + p.po * 1.3 + p.rest * 0.25 + sup + p.co;
  else if (gameState.surface == "grass")
    rand = p.fo * 1.7 + p.ba * 1.7 + p.vo * 1.7 + p.dr * 0.5 + p.sp + p.st * 0.75 + p.po * 2 + p.rest * 0.75 + sup + p.co;
  else if (gameState.surface == "hardcourt")
    rand = p.fo * 1.7 + p.ba * 1.7 + p.vo * 1.2 + p.dr + p.sp * 1.5 + p.st * 1.5 + p.po * 1.7 + p.rest * 0.5 + sup + p.co;
  else if (gameState.surface == "carpet")
    rand = p.fo * 1.9 + p.ba * 1.9 + p.vo * 1.5 + p.dr * 0.75 + p.sp + p.st + p.po * 2.1 + p.rest + sup + p.co;
  else
    rand = p.fo * 1.5 + p.ba * 1.5 + p.vo * 1.3 + p.dr + p.sp * 1.5 + p.st * 1.5 + p.po * 1.7 + p.rest * 0.66 + sup + p.co;


  let prob = Math.floor(Math.random() * (rand)) + p.form * 2;
  return prob;
}

function calcular(jug, tipoPrimerSaque, tipoSegundoSaque, num, player, buffer, surface){ //terminado refactoreo
  //console.log("Entre a calcular()");
  console.log("buffer: ",buffer);
  if (jug == 1) {
    let difi = Math.round(Math.random() * 15) + player.ser1;
    switch (tipoPrimerSaque) {
      case 1:
        if (difi > 15) {
          buffer.sup = buffer.sup + 15;
          if (surface == "clay") buffer.sup = buffer.sup + player.ser1;
          else if (surface = "grass") buffer.sup = buffer.sup + player.ser1 * 2.5;
          else if (surface == "hardcourt") buffer.sup = buffer.sup + player.ser1 * 2;
          else if (surface == "carpet") buffer.sup = buffer.sup + player.ser1 * 3;
          else buffer.sup = buffer.sup + player.ser1 * 1.5;
        }
        else {
          if (num == 1) calcular(jug, tipoSegundoSaque, 0, 2, player, buffer);
          else buffer.sup = 0;
        }
        break;

      case 2:
        if (difi > 12) {
          buffer.sup = buffer.sup + 10;
          if (surface == "clay") buffer.sup = buffer.sup + player.ser1;
          else if (surface = "grass") buffer.sup = buffer.sup + player.ser1 * 2.5;
          else if (surface == "hardcourt") buffer.sup = buffer.sup + player.ser1 * 2;
          else if (surface == "carpet") buffer.sup = buffer.sup + player.ser1 * 3;
          else buffer.sup = buffer.sup + player.ser1 * 1.5;
        }
        else {
          if (num == 1) calcular(jug, tipoSegundoSaque, 0, 2, player, buffer);
          else buffer.sup = 0;
        }
        break;

      case 3:
        if (difi > 10) {
          buffer.sup = buffer.sup + 5;
          if (surface == "clay") buffer.sup = buffer.sup + player.ser1;
          else if (surface = "grass") buffer.sup = buffer.sup + player.ser1 * 2.5;
          else if (surface == "hardcourt") buffer.sup = buffer.sup + player.ser1 * 2;
          else if (surface == "carpet") buffer.sup = buffer.sup + player.ser1 * 3;
          else buffer.sup = buffer.sup + player.ser1 * 1.5;
        }
        else {
          if (num == 1) calcular(jug, tipoSegundoSaque, 0, 2, player, buffer);
          else buffer.sup = 0;
        }
        break;
    }
  }

  if (jug == 2) {
    let difi = Math.round(Math.random() * 15) + player.ser2;
    switch (tipoPrimerSaque) {
      case 1:
        if (difi > 15) {
          buffer.sup = buffer.sup + 15;
          if (surface == "clay") buffer.sup = buffer.sup + player.ser2;
          else if (surface = "grass") buffer.sup = buffer.sup + player.ser2 * 2.5;
          else if (surface == "hardcourt") buffer.sup = buffer.sup + player.ser2 * 2;
          else if (surface == "carpet") buffer.sup = buffer.sup + player.ser2 * 3;
          else buffer.sup = buffer.sup + player.ser2 * 1.5;
        }
        else {
          if (num == 1) calcular(jug, tipoSegundoSaque, 0, 2, player, buffer);
          else buffer.sup = 0;
        }
        break;

      case 2:
        if (difi > 12) {
          buffer.sup = buffer.sup + 10;
          if (surface == "clay") buffer.sup = buffer.sup + player.ser2;
          else if (surface = "grass") buffer.sup = buffer.sup + player.ser2 * 2.5;
          else if (surface == "hardcourt") buffer.sup = buffer.sup + player.ser2 * 2;
          else if (surface == "carpet") buffer.sup = buffer.sup + player.ser2 * 3;
          else buffer.sup = buffer.sup + player.ser2 * 1.5;
        }
        else {
          if (num == 1) calcular(jug, tactic.second2, 2, player, buffer);
          else buffer.sup = 0;
        }
        break;

      case 3:
        if (difi > 10) {
          buffer.sup = buffer.sup + 5;
          if (surface == "clay") buffer.sup = buffer.sup + player.ser2;
          else if (surface = "grass") buffer.sup = buffer.sup + player.ser2 * 2.5;
          else if (surface == "hardcourt") buffer.sup = buffer.sup + player.ser2 * 2;
          else if (surface == "carpet") buffer.sup = buffer.sup + player.ser2 * 3;
          else buffer.sup = buffer.sup + player.ser2 * 1.5;
        }
        else {
          if (num == 1) calcular(jug, tactic.second2, 2, player, buffer);
          else buffer.sup = 0;
        }
        break;
    }
  }
}

function processClock(gameState) {    //Terminado refactoreo
  gameState.tiempo = gameState.tiempo + Math.floor(Math.random() * 90);

  if (gameState.tiempo < 60) {
    document.getElementById("timet").innerHTML =
      "<font color='#FFFF00' face='OCR A Extended'><center>" +
      "0:00" +
      "</center></font>";
  } else {
    let tiempo_m_condecimal = gameState.tiempo / 60;
    let tiempo_m_sindecimal = parseInt(tiempo_m_condecimal);
    let tiempo_s = gameState.tiempo % 60;
    if (tiempo_m_sindecimal < 60) {
      if (tiempo_m_sindecimal < 10) {
        document.getElementById("timet").innerHTML =
          "<font color='#FFFF00' face='OCR A Extended'><center>" +
          "0:0" +
          tiempo_m_sindecimal +
          "</center></font>";
      } else {
        document.getElementById("timet").innerHTML =
          "<font color='#FFFF00' face='OCR A Extended'><center>" +
          "0:" +
          tiempo_m_sindecimal +
          "</center></font>";
      }
    } else {
      let tiempo_h_condecimal = tiempo_m_sindecimal / 60;
      let tiempo_h_sindecimal = parseInt(tiempo_h_condecimal);
      let tiempo_m = tiempo_m_sindecimal % 60;
      if (tiempo_m < 10) {
        document.getElementById("timet").innerHTML =
          "<font color='#FFFF00' face='OCR A Extended'><center>" +
          tiempo_h_sindecimal +
          ":0" +
          tiempo_m +
          "</center></font>";
      } else {
        document.getElementById("timet").innerHTML =
          "<font color='#FFFF00' face='OCR A Extended'><center>" +
          tiempo_h_sindecimal +
          ":" +
          tiempo_m +
          "</center></font>";
      }
    }
  }
}

function cero(gameState) {   //Terminado refactoreo
  gameState.punto1 = 0;
  gameState.punto2 = 0;
  gameState.game1 = 0;
  gameState.game2 = 0;
  gameState.chequeo = 1;
  document.getElementById("tie").innerHTML = "<font color='green'><b><center>Juego</center></b></font>";
}

document.getElementById("btnLaunch").addEventListener("click", () => {
  launch();
});

function setUpButtons(gameState) {
  document.getElementById("btnVelDw").addEventListener("click", () => {
    modificarVelocidad(0, gameState);
  });

  document.getElementById("btnVelUp").addEventListener("click", () => {
    modificarVelocidad(1, gameState);
  });

  document.getElementById("btnStop").addEventListener("click", () => {
    gameState.play = false;
  });
}

