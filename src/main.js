import { getPlayers, setGameStart, cambioSaque } from "./utils/interact.js";
import {} from "./utils/game.js";

function launch() {
  let { player1, player2, tactic1, tactic2 } = getPlayers();
  setGameStart(player1.name1, player2.name2);
  boostSkills(player1, player2, tactic1, tactic2);

  /* Seteo el saque */
  let saq = Math.round(Math.random() * 10) + 1;
  saq = cambioSaque(saq);

  let gameState = {
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
    surface: setSuperficie(),
    numberOfSets: setNumeroSets(),
  };

  boostSurface(gameState.surface, player1, player2);
  calcularClima();

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

  partido(player1, player2, gameState);
}

function partido(player1, player2, gameState) {
  alert("listo para comenzar el partido");

  processInjury(player1, player2, gameState);
  processRain(player1, player2, gameState);
  processTiebreak(player1, player2, gameState);

  if (game1 == game2 && game1 > 15 && set != 5) {
    fore1 = Math.round(Math.random() * 10);
    fore2 = Math.round(Math.random() * 10);
  }

  //Logica de puntos estandar
  if (tie == 0) {
    if (game1 == game2 && game1 >= 5) {
      if (control == 0) auxgame++;
      control = 1;
    }

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

    if (pts1 <= pts2 && punto1 == 4) {
      punto1--;
      punto2--;
    }
    if (pts2 < pts1 && punto2 == 4) {
      punto1--;
      punto2--;
    }

    resultado(punto1, punto2, game1, game2);

    if (game1 > 5 + auxgame) {
      set++;
      set1++;
      sta1 = sta1 - technique1;
      sta2 = sta2 - technique2;
      game1 = 0;
      game2 = 0;
      auxgame = 0;
      control = 0;
    }
    if (game2 > 5 + auxgame) {
      set++;
      set2++;
      sta1 = sta1 - technique1;
      sta2 = sta2 - technique2;
      game1 = 0;
      game2 = 0;
      auxgame = 0;
      control = 0;
    }

    tiempo = tiempo + Math.floor(Math.random() * 90);

    if (numberOfSets == 5) {
      if (set1 < 3 && set2 < 3) {
        setTimeout(
          "partido(fore1,back1,vol1,drop1,spe1,sta1,ser1,pow1,rest1,form1,fore2,back2,vol2,drop2,spe2,sta2,ser2,pow2,rest2,form2,punto1,punto2,game1,game2,set1,set2,control,consi1,consi2)",
          velocidad
        );
      }
    } //3 sets
    else {
      if (set1 < 2 && set2 < 2) {
        setTimeout(
          "partido(fore1,back1,vol1,drop1,spe1,sta1,ser1,pow1,rest1,form1,fore2,back2,vol2,drop2,spe2,sta2,ser2,pow2,rest2,form2,punto1,punto2,game1,game2,set1,set2,control,consi1,consi2)",
          velocidad
        );
      }
    }
  }

  processClock(gameState);
}

function boostSkills(player1, player2, tactic1, tactic2) {
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
  player1.fore1 = player1.fore1 + player1.technique1 * 1.5;
  player1.back1 = player1.back1 + player1.technique1 * 1.5;
  player2.fore2 = player2.fore2 + player2.technique2 * 1.5;
  player2.back2 = player2.back2 + player2.technique2 * 1.5;
}

function boostSurface(surface, player1, player2) {
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
  for (let i = 0; i < MatchSurface.surface.length; i++) {
    if (MatchSurface.surface[i].checked) return MatchSurface.surface[i].value;
  }
}

//FIXME: chequear
function setNumeroSets() {
  for (let i = 0; i < setsNumber.setsNum.length; i++) {
    if (setsNumber.setsNum[i].checked) return setsNumber.setsNum[i].value;
  }
}

function calcularClima(gameState) {
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

function lesionar(fm, st) {
  return Math.floor(Math.random() * 99) + fm * 3 + st;
}

function saltarLesion(gameState) {
  if (gameState.numberOfSets == 3)
    gameState.puntoLesion = Math.floor(Math.random() * 299);
  else if (gameState.numberOfSets == 5)
    gameState.puntoLesion = Math.floor(Math.random() * 499);
}

function modificarVelocidad(vel, gameState) {
  if (vel == 1 && gameState.velocidad > 100)
    gameState.velocidad = gameState.velocidad - 225;
  if (vel == 0 && gameState.velocidad < 1900)
    gameState.velocidad = gameState.velocidad + 225;
}

function processInjury(player1, player2, gameState) {
  if (
    gameState.pLesion1 <= 40 &&
    gameState.pLesion1 < gameState.plesion2 &&
    gameState.puntosJugados == gameState.puntoLesion &&
    gameState.ya_lesion == 0
  ) {
    calcularLesion(gameState.name1, gameState.name2);
    return;
  } else if (
    gameState.pLesion2 <= 40 &&
    gameState.pLesion2 < gameState.pLesion1 &&
    gameState.puntosJugados == gameState.puntoLesion &&
    gameState.ya_lesion == 0
  ) {
    calcularLesion(gameState.name2, gameState.name1);
    return;
  }
}

function processRain(player1, player2, gameState) {
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

function processTiebreak(player1, player2, gameState) {
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

  tiempo = tiempo + Math.floor(Math.random() * 90);
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

function processClock(gameState) {
  if (gameState.tiempo < 60) {
    document.getElementById("timet").innerHTML =
      "<font color='#FFFF00' face='OCR A Extended'><center>" +
      "0:00" +
      "</center></font>";
  } else {
    tiempo_m_condecimal = gameState.tiempo / 60;
    tiempo_m_sindecimal = parseInt(tiempo_m_condecimal);
    tiempo_s = gameState.tiempo % 60;
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
      tiempo_h_condecimal = tiempo_m_sindecimal / 60;
      tiempo_h_sindecimal = parseInt(tiempo_h_condecimal);
      tiempo_m = tiempo_m_sindecimal % 60;
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

function cero(gameState)
{
  gameState.punto1=0;
  gameState.punto2=0;
  gameState.game1=0;
  gameState.game2=0;
  gameState.chequeo=1;
  document.getElementById("tie").innerHTML="<font color='green'><b><center>Juego</center></b></font>";
}

document.getElementById("btnLaunch").addEventListener("click", () => {
  launch();
});

document.getElementById("btnVelDw").addEventListener("click", () => {
  modificarVelocidad(0, gameState); //FIXME: gameState
});

document.getElementById("btnVelUp").addEventListener("click", () => {
  modificarVelocidad(1, gameState); //FIXME: gameState
});
