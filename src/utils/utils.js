export function boostSkills(player1, player2, tactic1, tactic2) {  //Terminado refactoreo
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

export function boostSurface(surface, player1, player2) {  //Terminado refactoreo
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
export function setSuperficie() {
  // for (let i = 0; i < MatchSurface.surface.length; i++) {
  //   if (MatchSurface.surface[i].checked) return MatchSurface.surface[i].value;
  // }
  let s = document.getElementById("surface").options[
      document.getElementById("surface").selectedIndex
    ].value;
  return s;
}

//FIXME: chequear
export function setNumeroSets() {
  for (let i = 0; i < setsNumber.setsNum.length; i++) {
    if (setsNumber.setsNum[i].checked) return setsNumber.setsNum[i].value;
  }
}

export function setClima(gameState) { //Terminado refactoreo
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

export function setLesion(player1, player2, gameState) {  //Terminado refactoreo
  do {
    gameState.pLesion1 = lesionar(player1.form1, player1.sta1);
    gameState.pLesion2 = lesionar(player2.form2, player2.sta2);
  } while (
    gameState.pLesion1 == gameState.pLesion2 &&
    (gameState.pLesion1 <= 40 || gameState.pLesion2 <= 40)
  );

  if (gameState.pLesion1 <= 40 || gameState.pLesion2 <= 40)
    saltarLesion(gameState);
};

function lesionar(fm, st) {   //Terminado refactoreo
  return Math.floor(Math.random() * 99) + fm * 3 + st;
}

function saltarLesion(gameState) {  //Terminado refactoreo
  if (gameState.numberOfSets == 3)
    gameState.puntoLesion = Math.floor(Math.random() * 299);
  else if (gameState.numberOfSets == 5)
    gameState.puntoLesion = Math.floor(Math.random() * 499);
}

export function modificarVelocidad(vel, gameState) {   //Terminado refactoreo
  if (vel == 3 && gameState.velocidad > 100)
    gameState.velocidad = gameState.velocidad * 0.5;
  if (vel == 2 && gameState.velocidad > 100)
    gameState.velocidad = gameState.velocidad * 0.9;
  if (vel == 1 && gameState.velocidad < 1900)
    gameState.velocidad = gameState.velocidad * 1.1;
  if (vel == 0 && gameState.velocidad < 1900)
    gameState.velocidad = gameState.velocidad * 1.5;
}

function cero(gameState) {   //Terminado refactoreo
  gameState.punto1 = 0;
  gameState.punto2 = 0;
  gameState.game1 = 0;
  gameState.game2 = 0;
  gameState.chequeo = 1;
  document.getElementById("tie").innerHTML = "<font color='green'><b><center>Juego</center></b></font>";
}