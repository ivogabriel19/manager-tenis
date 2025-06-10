import { getPlayers, setGameStart, cambioSaque } from "./utils/interact.js";
import {} from "./utils/game.js"

document.getElementById('btnLaunch').addEventListener('click', () => {
  launch();
});

document.getElementById('btnVelDw').addEventListener('click', () => {
  modificarVelocidad(0);
});

document.getElementById('btnVelUp').addEventListener('click', () => {
  modificarVelocidad(1);
});

function launch() {
  let { player1, player2, tactic1, tactic2 } = getPlayers();
  setGameStart(player1.name1, player2.name2);
  boostSkills(player1, player2, tactic1, tactic2);

  /* Seteo el saque */
  let saq = Math.round(Math.random() * 10) + 1;
  saq = cambioSaque(saq);

  let gameState = {
	  punto1:0,
	  punto2:0,
	  game1:0,
	  game2:0,
	  set:1,
	  set1:0,
	  set2:0,
	  auxpunto:0,
	  auxgame:0,
	  tie:0,
	  control:0,
	  auxtie:0,
	  chequeo:0,
	  velocidad:1000,
	  cont:0,
	  ya_lesion:0,
	  lluvia:0,
	  tiempo : 0,
    puntoLesion: 999, //no deberia llegar al 999
	  surface: setSuperficie(),
    numberOfSets: setNumeroSets()
  }

  boostSurface(gameState.surface, player1, player2);
  calcularTiempo();
  
  let puntosJugados=0;
  let mensajeExpuesto=false;
  let lesion1=0;
  let lesion2=0;
  
  do{
    lesion1=lesionar(player1.form1, player1.sta1);
    lesion2=lesionar(player2.form2, player2.sta2);
  }while(lesion1==lesion2 && (lesion1<=40 || lesion2<=40));
  
  if(lesion1<=40 || lesion2<=40) saltarLesion(gameState);
  
  partido(player1, player2, gameState);
}

function partido(){
  alert("listo para comenzar el partido")
}

function boostSkills(player1, player2, tactic1, tactic2){
  /* Bost de habilidades segun tactica */
  if (tactic1.position1 == 1) {
    player1.drop1++;
    player1.vol1++;
  }
  if (tactic1.position1 == 2) 
    player1.pow1++;
  if (tactic2.position2 == 1) {
    player2.drop2++;
    player2.vol2++;
  }
  if (tactic2.position2 == 2) 
    player2.pow2++;
  
  /* Bost de habilidades segun tecnica */
  player1.fore1 = player1.fore1 + player1.technique1 * 1.5;
  player1.back1 = player1.back1 + player1.technique1 * 1.5;
  player2.fore2 = player2.fore2 + player2.technique2 * 1.5;
  player2.back2 = player2.back2 + player2.technique2 * 1.5;
}

function boostSurface(surface, player1, player2){
  if(surface==player1.surf1)
	  {
	  	switch(surface)
	  	{
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
	  }
	  else
	  {
		if(player1.surf1=="neutral")
		{
			switch(surface)
	  		{
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

	  if(surface==player2.surf2)
	  {
	  	switch(surface)
	  	{
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
	  }
	  else
	  {
		if(player2.surf2=="neutral")
		{
			switch(surface)
	  		{
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
function setSuperficie()
{
  for (let i = 0; i < MatchSurface.surface.length; i++)
  {
    if(MatchSurface.surface[i].checked)return MatchSurface.surface[i].value;
  }
}

//FIXME: chequear
function setNumeroSets()
{
  for (let i = 0; i < setsNumber.setsNum.length; i++)
  {
    if(setsNumber.setsNum[i].checked)return setsNumber.setsNum[i].value;
  }
}

function calcularTiempo(gameState)
{
//Previsiones: Soleado(0-80), Parcialmente nublado(81-90), Nublado(91-96), Posibles Chubascos(97-99), Chubascos(100)
  let rn = Math.round(Math.random()*100);
  if(rn<81) document.getElementById("prev_tiempo").innerHTML="<img src='./img/tiempo/soleado.svg'></img>";
  if(rn>80 && rn<91) document.getElementById("prev_tiempo").innerHTML="<img src='./img/tiempo/parcnublado.svg'></img>";
  if(rn>90 && rn<97) document.getElementById("prev_tiempo").innerHTML="<img src='./img/tiempo/nublado.svg'></img>";
  if(rn>96 && rn<100)
  {
    document.getElementById("prev_tiempo").innerHTML="<img src='./img/tiempo/inestable.svg'></img>";
    let punto_lluvia = Math.round(Math.random()*100);
    if(punto_lluvia < 81)
    {
      if(gameState.numberOfSets==3)puntosalto_lluvia=Math.floor(Math.random()* 299);
        else if(gameState.numberOfSets==5)puntosalto_lluvia=Math.floor(Math.random()* 499);
      gameState.lluvia=1;
    }
  }
  if(rn>99)
  {
    document.getElementById("prev_tiempo").innerHTML="<img src='./img/tiempo/lluvia.svg'></img>";
    if(gameState.numberOfSets==3)puntosalto_lluvia=Math.floor(Math.random()* 299);
      else if(gameState.numberOfSets==5)puntosalto_lluvia=Math.floor(Math.random()* 499);
    gameState.lluvia=1;
  }
}

function lesionar(fm,st){
  return Math.floor(Math.random()* 99)+fm*3+st;  
}

function saltarLesion(gameState){
  if(gameState.numberOfSets==3)
    gameState.puntoLesion=Math.floor(Math.random()* 299);
  else if(gameState.numberOfSets==5)
    gameState.puntoLesion=Math.floor(Math.random()* 499);
}

function modificarVelocidad(vel)
{
  if((vel==1) && (gameState.velocidad > 100))  gameState.velocidad=gameState.velocidad-225;
  if((vel==0) && (gameState.velocidad < 1900)) gameState.velocidad=gameState.velocidad+225;  
}