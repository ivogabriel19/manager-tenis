import { cambioSaque } from "./interact.js";

export function partido(player1, player2, tactic1, tactic2, gameState) {
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

export function playPoint(player1, player2, tactic1, tactic2, gameState) {  //Terminado refactoreo
  //console.log("Entre a playPoint()");
  //console.log(gameState);
  if (gameState.tie == 0  && gameState.play) {
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
      if (gameState.set1 < 3 && gameState.set2 < 3) {
        setTimeout(partido, gameState.velocidad, player1, player2, tactic1, tactic2, gameState);
      }
    } 
    else if (gameState.numberOfSets == 3) { //3 sets
      if (gameState.set1 < 2 && gameState.set2 < 2) {
        setTimeout(partido, gameState.velocidad, player1, player2, tactic1, tactic2, gameState);
      }
    }

  }

  if (!gameState.play) {
    console.log("Partido detenido por el usuario.");
    setTimeout(playPoint, gameState.velocidad, player1, player2, tactic1, tactic2, gameState);
  }

}

export function processTiebreak(player1, player2, gameState) {   //Terminado refactoreo
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

    setTimeout(tiebreak, gameState.velocidad, player1, player2, gameState);
  }
}

//TODO: seguir adaptando
export function tiebreak(player1, player2, gameState) {
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

export function probs(player1, player2, tactic, jug, gameState) { // listo?
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

export function calcular(jug, tipoPrimerSaque, tipoSegundoSaque, num, player, buffer, surface){ //terminado refactoreo
  //console.log("Entre a calcular()");
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
          if (num == 1) calcular(jug, tipoSegundoSaque, 2, player, buffer);
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
          if (num == 1) calcular(jug, tipoSegundoSaque, 2, player, buffer);
          else buffer.sup = 0;
        }
        break;
    }
  }
}

function processInjury(gameState) {   //Terminado refactoreo
  if (
    gameState.pLesion1 <= 40 &&
    gameState.pLesion1 < gameState.pLesion2 &&
    gameState.puntosJugados == gameState.puntoLesion &&
    gameState.ya_lesion == 0
  ) {
    processInjury(gameState);
    return;
  } else if (
    gameState.pLesion2 <= 40 &&
    gameState.pLesion2 < gameState.pLesion1 &&
    gameState.puntosJugados == gameState.puntoLesion &&
    gameState.ya_lesion == 0
  ) {
    processInjury(gameState);
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