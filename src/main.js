import { getPlayers, setGameStart } from "./utils/interact.js";
import { partido } from "./utils/game.js";
import {  boostSkills, 
          boostSurface, 
          setSuperficie, 
          setNumeroSets, 
          setClima, 
          setLesion,
          modificarVelocidad
} from "./utils/utils.js";

function launch() { //Terminado refactoreo
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
  let { player1, player2, tactic1, tactic2 } = getPlayers();
  //console.log(player1, player2, tactic1, tactic2);

  /* Seteo el saque */
  //let saq = Math.round(Math.random() * 10) + 1;
  //saq = cambioSaque(saq);

  setUpButtons(gameState);
  setGameStart(player1.nomb1, player2.nomb2);
  boostSkills(player1, player2, tactic1, tactic2);
  boostSurface(gameState.surface, player1, player2);
  setClima(gameState);
  setLesion(player1, player2, gameState);

  let mensajeExpuesto = false;

  partido(player1, player2, tactic1, tactic2, gameState);
}

document.getElementById("btnLaunch").addEventListener("click", () => {
  launch();
});

function setUpButtons(gameState) {
  document.getElementById("btnVelx-").addEventListener("click", () => {
    modificarVelocidad(0, gameState);
  });
  document.getElementById("btnVelDw").addEventListener("click", () => {
    modificarVelocidad(1, gameState);
  });

  document.getElementById("btnVelUp").addEventListener("click", () => {
    modificarVelocidad(2, gameState);
  });
  document.getElementById("btnVelx+").addEventListener("click", () => {
    modificarVelocidad(3, gameState);
  });

  document.getElementById("btnStop").addEventListener("click", () => {
    gameState.play = !gameState.play;
    document.getElementById("btnStop").innerHTML = gameState.play ? "Stop" : "Play";
    document.getElementById("btnStop").classList.toggle("redBtn");
    document.getElementById("btnStop").classList.toggle("ylwBtn");
  });
}

