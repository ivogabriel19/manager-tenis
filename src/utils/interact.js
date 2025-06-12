export function getPlayers() {
  let name1 = document.getElementById("jugador1").options[document.getElementById("jugador1").selectedIndex].value;
  let name2 = document.getElementById("jugador2").options[document.getElementById("jugador2").selectedIndex].value;
  let surf1 = document.getElementById("surface1").options[document.getElementById("surface1").selectedIndex].value;
  let surf2 = document.getElementById("surface2").options[document.getElementById("surface2").selectedIndex].value;
  let nomb1 = document.getElementById("jugador1").options[document.getElementById("jugador1").selectedIndex].text;
  let nomb2 = document.getElementById("jugador2").options[document.getElementById("jugador2").selectedIndex].text;
  let fore1 = parseInt(document.getElementById("forehand1").options[document.getElementById("forehand1").selectedIndex].value);
  let fore2 = parseInt(document.getElementById("forehand2").options[document.getElementById("forehand2").selectedIndex].value);
  let back1 = parseInt(document.getElementById("backhand1").options[document.getElementById("backhand1").selectedIndex].value);
  let back2 = parseInt(document.getElementById("backhand2").options[document.getElementById("backhand2").selectedIndex].value);
  let vol1 = parseInt(document.getElementById("volley1").options[document.getElementById("volley1").selectedIndex].value);
  let vol2 = parseInt(document.getElementById("volley2").options[document.getElementById("volley2").selectedIndex].value);
  let drop1 = parseInt(document.getElementById("dropshot1").options[document.getElementById("dropshot1").selectedIndex].value);
  let drop2 = parseInt(document.getElementById("dropshot2").options[document.getElementById("dropshot2").selectedIndex].value);
  let spe1 = parseInt(document.getElementById("speed1").options[document.getElementById("speed1").selectedIndex].value);
  let spe2 = parseInt(document.getElementById("speed2").options[document.getElementById("speed2").selectedIndex].value);
  let sta1 = parseInt(document.getElementById("stamina1").options[document.getElementById("stamina1").selectedIndex].value);
  let sta2 = parseInt(document.getElementById("stamina2").options[document.getElementById("stamina2").selectedIndex].value);
  let ser1 = parseInt(document.getElementById("service1").options[document.getElementById("service1").selectedIndex].value);
  let ser2 = parseInt(document.getElementById("service2").options[document.getElementById("service2").selectedIndex].value);
  let pow1 = parseInt(document.getElementById("power1").options[document.getElementById("power1").selectedIndex].value);
  let pow2 = parseInt(document.getElementById("power2").options[document.getElementById("power2").selectedIndex].value);
  let rest1 = parseInt(document.getElementById("resto1").options[document.getElementById("resto1").selectedIndex].value);
  let rest2 = parseInt(document.getElementById("resto2").options[document.getElementById("resto2").selectedIndex].value);
  let consi1 = parseInt(document.getElementById("consistencia1").options[document.getElementById("consistencia1").selectedIndex].value);
  let consi2 = parseInt(document.getElementById("consistencia2").options[document.getElementById("consistencia2").selectedIndex].value);
  let form1 = parseInt(document.getElementById("form1").options[document.getElementById("form1").selectedIndex].value);
  let form2 = parseInt(document.getElementById("form2").options[document.getElementById("form2").selectedIndex].value);
  let technique1 = parseInt(document.getElementById("technique1").options[document.getElementById("technique1").selectedIndex].value);
  let technique2 = parseInt(document.getElementById("technique2").options[document.getElementById("technique2").selectedIndex].value);
  let position1 = parseInt(document.getElementById("position1").options[document.getElementById("position1").selectedIndex].value);
  let position2 = parseInt(document.getElementById("position2").options[document.getElementById("position2").selectedIndex].value);
  let strategy1 = parseInt(document.getElementById("strategy1").options[document.getElementById("strategy1").selectedIndex].value);
  let strategy2 = parseInt(document.getElementById("strategy2").options[document.getElementById("strategy2").selectedIndex].value);
  let first1 = parseInt(document.getElementById("first1").options[document.getElementById("first1").selectedIndex].value);
  let first2 = parseInt(document.getElementById("first2").options[document.getElementById("first2").selectedIndex].value);
  let second1 = parseInt(document.getElementById("second1").options[document.getElementById("second1").selectedIndex].value);
  let second2 = parseInt(document.getElementById("second2").options[document.getElementById("second2").selectedIndex].value);

  let player1 = {
    name1,
    nomb1,
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
    consi1,
    surf1,
  };
  let player2 = {
    name2,
    nomb2,
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
    consi2,
    surf2,
  };
  let tactic1 = {
    technique1,
    position1,
    strategy1,
    first1,
    second1,
  };
  let tactic2 = {
    technique2,
    position2,
    strategy2,
    first2,
    second2,
  };

  //console.log(player1, player2, tactic1, tactic2);
  return { player1, player2, tactic1, tactic2 };
}

export function setGameStart(nombre1, nombre2) {
  setImgTournament();
  document.getElementById("im_jug1").innerHTML =
    "<img src='./Imagenes/Jugadores/" + nombre1 + ".jpg'></img>";
  document.getElementById("im_jug2").innerHTML =
    "<img src='./Imagenes/Jugadores/" + nombre2 + ".jpg'></img>";

  document.getElementById("set11").innerHTML = "<center>-</center>";
  document.getElementById("set12").innerHTML = "<center>-</center>";
  document.getElementById("set13").innerHTML = "<center>-</center>";
  document.getElementById("set14").innerHTML = "<center>-</center>";
  document.getElementById("set15").innerHTML = "<center>-</center>";
  document.getElementById("set21").innerHTML = "<center>-</center>";
  document.getElementById("set22").innerHTML = "<center>-</center>";
  document.getElementById("set23").innerHTML = "<center>-</center>";
  document.getElementById("set24").innerHTML = "<center>-</center>";
  document.getElementById("set25").innerHTML = "<center>-</center>";
  document.getElementById("res1").innerHTML =
    "<center><b><font color='#00CCFF' face = 'helvetica'>" +
    nombre1 +
    "</b></center></font>";
  document.getElementById("res2").innerHTML =
    "<center><b><font color='#00CCFF' face = 'helvetica'>" +
    nombre2 +
    "</b></center></font>";
}

function setImgTournament() {
  let tipo_p = parseInt(
    document.getElementById("mType").options[
      document.getElementById("mType").selectedIndex
    ].value
  );

  switch (tipo_p) {
    case 0:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/Amistoso.png'></img>";
      break;
    case 1:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/jjoo.svg'></img>";
      break;
    case 2:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/challenger.png'></img>";
      break;
    case 3:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/atp250.png'></img>";
      break;
    case 4:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/atp500.png'></img>";
      break;
    case 5:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/atp1000.png'></img>";
      break;
    case 6:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/AO.png'></img>";
      break;
    case 7:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/RG.png'></img>";
      break;
    case 8:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/WB.png'></img>";
      break;
    case 9:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/US.png'></img>";
      break;
    case 10:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/atp-finals.svg'></img>";
      break;
    case 11:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/davis.png'></img>";
      break;
    case 12:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/WTA.png'></img>";
      break;
    case 13:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/WTA.png'></img>";
      break;
    case 14:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/WTA.png'></img>";
      break;
    case 15:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/WTATour.png'></img>";
      break;
    case 16:
      document.getElementById("im_torneo").innerHTML =
        "<img src='./img/torneos/FedCup.png'></img>";
      break;
  }
}

export function cambioSaque(saq) {
  if (saq == 1) {
    document.getElementById("s2").innerHTML ="<center><img  src='./img/tenis.png'></center>";
    document.getElementById("s1").innerHTML = "<center>&nbsp;</center>";
    saq = 2;
  } else {
    document.getElementById("s1").innerHTML ="<center><img  src='./img/tenis.png'></center>";
    document.getElementById("s2").innerHTML = "<center>&nbsp;</center>";
    saq = 1;
  }
}