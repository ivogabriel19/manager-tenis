let hombres = [];
let mujeres = [];
let veteranos = [];
let raquetas = [];
let jugadoresraquetas = [];

function cargarDesdeJSON() {
	fetch('../src/data/hombres.json')
		.then(res => res.json())
		.then(data => {
			hombres = data.map(j => [
				j.name,
				j.fore,
				j.back,
				j.drop,
				j.vol,
				j.sped,
				j.stam,
				j.serv,
				j.pow,
				j.rest,
				j.cosi,
				j.form,
				j.surf
			]);
			//console.log("Jugadores cargados:", hombres);
		})
		.catch(err => console.error('Error cargando jugadores:', err));

	fetch('../src/data/raquetas.json')
		.then(res => res.json())
		.then(data => {
			raquetas = data.map(r => r.valores);
			//console.log("Raquetas cargadas:", raquetas);
		})
		.catch(err => console.error('Error cargando raquetas:', err));

	fetch('../src/data/jugadoresRaquetas.json')
		.then(res => res.json())
		.then(data => {
			jugadoresraquetas = []; // asegurate de inicializarlo
			data.forEach(jugador => {
				jugadoresraquetas[jugador.index] = [jugador.nombre, jugador.raqueta];
			});
			//console.log("Jugadores-raquetas cargados:", jugadoresraquetas);
		})
		.catch(error => {
			console.error('Error al cargar o procesar el JSON:', error);
		});
}

cargarDesdeJSON();


window.onload = function () {
	var comboJugador1 = document.getElementById("jugador1");
	var comboJugador2 = document.getElementById("jugador2");

	hombres.sort(compara);
	mujeres.sort(compara);
	veteranos.sort(compara);

	jugadores = new Array();
	jugadores = hombres.concat(veteranos);
	jugadores = jugadores.concat(mujeres);

	for (i in jugadores) {
		var opcion1 = new Option(jugadores[i][0], i);
		var opcion2 = new Option(jugadores[i][0], i);
		comboJugador1.options[i] = opcion1;
		comboJugador2.options[i] = opcion2;
	}
}

function cargarCaracteristicas(num) {
	var combo = document.getElementById("jugador" + num);
	var comboForehand = document.getElementById("forehand" + num);
	var comboBackhand = document.getElementById("backhand" + num);
	var comboVolley = document.getElementById("volley" + num);
	var comboDropshot = document.getElementById("dropshot" + num);
	var comboSpeed = document.getElementById("speed" + num);
	var comboStamina = document.getElementById("stamina" + num);
	var comboService = document.getElementById("service" + num);
	var comboPower = document.getElementById("power" + num);
	var comboResto = document.getElementById("resto" + num);
	var comboConsi = document.getElementById("consistencia" + num);
	var comboForm = document.getElementById("form" + num);
	var comboSurface = document.getElementById("surface" + num);

	comboForehand.value = jugadores[combo.value][1];
	comboBackhand.value = jugadores[combo.value][2];
	comboVolley.value = jugadores[combo.value][3];
	comboDropshot.value = jugadores[combo.value][4];
	comboSpeed.value = jugadores[combo.value][5];
	comboStamina.value = jugadores[combo.value][6];
	comboService.value = jugadores[combo.value][7];
	comboPower.value = jugadores[combo.value][8];
	comboResto.value = jugadores[combo.value][9];
	comboConsi.value = jugadores[combo.value][10];
	comboForm.value = jugadores[combo.value][11];
	comboSurface.value = jugadores[combo.value][12];

	var blnRaquetaEncontrada = 0;
	for (i in jugadoresraquetas) {
		if (combo.options[combo.selectedIndex].text == jugadoresraquetas[i][0]) {
			var btnJugador = document.getElementById("MenosRaquetaJugador" + num);
			btnJugador.style.visibility = 'visible';
			blnRaquetaEncontrada = 1;
			break;
		}
	}
	if (blnRaquetaEncontrada == 0) {
		var btnJugador = document.getElementById("MenosRaquetaJugador" + num);
		btnJugador.style.visibility = 'hidden';
	}
}

function compara(a, b) {
	return (a[0] < b[0] ? "-1" : "1");
}

function CambiarNumSets(num) {
	var optNumSets = document.setsNumber.setsNum;
	if (num == 6 || num == 7 || num == 8 || num == 9 || num == 11) {
		optNumSets[1].checked = true;
	}
	else {
		optNumSets[0].checked = true;
	}
}

function AniadirRaqueta(num) {
	var combo = document.getElementById("jugador" + num);
	for (i in jugadoresraquetas) {
		if (combo.options[combo.selectedIndex].text == jugadoresraquetas[i][0]) {
			var PosRaqueta = jugadoresraquetas[i][1]
			break;
		}
	}

	var comboForehand = document.getElementById("forehand" + num);
	var comboBackhand = document.getElementById("backhand" + num);
	var comboVolley = document.getElementById("volley" + num);
	var comboDropshot = document.getElementById("dropshot" + num);
	var comboSpeed = document.getElementById("speed" + num);
	var comboStamina = document.getElementById("stamina" + num);
	var comboService = document.getElementById("service" + num);
	var comboPower = document.getElementById("power" + num);
	var comboResto = document.getElementById("resto" + num);
	var comboConsi = document.getElementById("consistencia" + num);
	var comboForm = document.getElementById("form" + num);
	var comboSurface = document.getElementById("surface" + num);

	if (parseInt(comboForehand.value)
		+ parseInt(raquetas[PosRaqueta][0]) <= 10
		&&
		parseInt(comboForehand.value)
		+ parseInt(raquetas[PosRaqueta][0]) >= 0)
		comboForehand.value = parseInt(comboForehand.value)
			+ parseInt(raquetas[PosRaqueta][0]);
	else {
		if (parseInt(comboForehand.value) + parseInt(raquetas[PosRaqueta][0]) < 0)
			comboForehand.value = 0;
		else comboForehand.value = 10;
	}

	if (parseInt(comboBackhand.value) + parseInt(raquetas[PosRaqueta][1]) <= 10 && parseInt(comboBackhand.value) + parseInt(raquetas[PosRaqueta][1]) >= 0) comboBackhand.value = parseInt(comboBackhand.value) + parseInt(raquetas[PosRaqueta][1]);
	else {
		if (parseInt(comboBackhand.value) + parseInt(raquetas[PosRaqueta][1]) < 0) comboBackhand.value = 0;
		else comboBackhand.value = 10;
	}

	if (parseInt(comboVolley.value) + parseInt(raquetas[PosRaqueta][2]) <= 10 && parseInt(comboVolley.value) + parseInt(raquetas[PosRaqueta][2]) >= 0) comboVolley.value = parseInt(comboVolley.value) + parseInt(raquetas[PosRaqueta][2]);
	else {
		if (parseInt(comboVolley.value) + parseInt(raquetas[PosRaqueta][0]) < 0) comboVolley.value = 0;
		else comboVolley.value = 10;
	}


	if (parseInt(comboDropshot.value) + parseInt(raquetas[PosRaqueta][3]) <= 10 && parseInt(comboDropshot.value) + parseInt(raquetas[PosRaqueta][3]) >= 0) comboDropshot.value = parseInt(comboDropshot.value) + parseInt(raquetas[PosRaqueta][3]);
	else {
		if (parseInt(comboDropshot.value) + parseInt(raquetas[PosRaqueta][0]) < 0) comboDropshot.value = 0;
		else comboDropshot.value = 10;
	}


	if (parseInt(comboSpeed.value) + parseInt(raquetas[PosRaqueta][4]) <= 10 && parseInt(comboSpeed.value) + parseInt(raquetas[PosRaqueta][4]) >= 0) comboSpeed.value = parseInt(comboSpeed.value) + parseInt(raquetas[PosRaqueta][4]);
	else {
		if (parseInt(comboSpeed.value) + parseInt(raquetas[PosRaqueta][0]) < 0) comboSpeed.value = 0;
		else comboSpeed.value = 10;
	}


	if (parseInt(comboStamina.value) + parseInt(raquetas[PosRaqueta][5]) <= 10 && parseInt(comboStamina.value) + parseInt(raquetas[PosRaqueta][5]) >= 0) comboStamina.value = parseInt(comboStamina.value) + parseInt(raquetas[PosRaqueta][5]);
	else {
		if (parseInt(comboStamina.value) + parseInt(raquetas[PosRaqueta][0]) < 0) comboStamina.value = 0;
		else comboStamina.value = 10;
	}


	if (parseInt(comboService.value) + parseInt(raquetas[PosRaqueta][6]) <= 10 && parseInt(comboService.value) + parseInt(raquetas[PosRaqueta][6]) >= 0) comboService.value = parseInt(comboService.value) + parseInt(raquetas[PosRaqueta][6]);
	else {
		if (parseInt(comboService.value) + parseInt(raquetas[PosRaqueta][0]) < 0) comboService.value = 0;
		else comboService.value = 10;
	}


	if (parseInt(comboPower.value) + parseInt(raquetas[PosRaqueta][7]) <= 10 && parseInt(comboPower.value) + parseInt(raquetas[PosRaqueta][7]) >= 0) comboPower.value = parseInt(comboPower.value) + parseInt(raquetas[PosRaqueta][7]);
	else {
		if (parseInt(comboPower.value) + parseInt(raquetas[PosRaqueta][0]) < 0) comboPower.value = 0;
		else comboPower.value = 10;
	}


	if (parseInt(comboResto.value) + parseInt(raquetas[PosRaqueta][8]) <= 10 && parseInt(comboResto.value) + parseInt(raquetas[PosRaqueta][8]) >= 0) comboResto.value = parseInt(comboResto.value) + parseInt(raquetas[PosRaqueta][8]);
	else {
		if (parseInt(comboResto.value) + parseInt(raquetas[PosRaqueta][0]) < 0) comboResto.value = 0;
		else comboResto.value = 10;
	}


	if (parseInt(comboConsi.value) + parseInt(raquetas[PosRaqueta][9]) <= 10 && parseInt(comboConsi.value) + parseInt(raquetas[PosRaqueta][9]) >= 0) comboConsi.value = parseInt(comboConsi.value) + parseInt(raquetas[PosRaqueta][9]);
	else {
		if (parseInt(comboConsi.value) + parseInt(raquetas[PosRaqueta][0]) < 0) comboConsi.value = 0;
		else comboConsi.value = 10;
	}


	let spanForehand = document.getElementById("span-forehand" + num);
	if (raquetas[PosRaqueta][0] != 0) spanForehand.innerHTML = raquetas[PosRaqueta][0];
		if (raquetas[PosRaqueta][0] > 0) {
			spanForehand.classList.add("suma");
		}
		if (raquetas[PosRaqueta][0] < 0) {
			spanForehand.classList.add("resta");
		}
	let spanBackhand = document.getElementById("span-backhand" + num);
	if (raquetas[PosRaqueta][1] != 0) spanBackhand.innerHTML = raquetas[PosRaqueta][1];
		if (raquetas[PosRaqueta][1] > 0) {
			spanBackhand.classList.add("suma");
		}
		if (raquetas[PosRaqueta][1] < 0) {
			spanBackhand.classList.add("resta");
		}
	let spanVolley = document.getElementById("span-volley" + num);
	if (raquetas[PosRaqueta][2] != 0) spanVolley.innerHTML = raquetas[PosRaqueta][2];
		if (raquetas[PosRaqueta][2] > 0) {
			spanVolley.classList.add("suma");
		}
		if (raquetas[PosRaqueta][2] < 0) {
			spanVolley.classList.add("resta");
		}
	let spanDropshot = document.getElementById("span-dropshot" + num);
	if (raquetas[PosRaqueta][3] != 0) spanDropshot.innerHTML = raquetas[PosRaqueta][3];
		if (raquetas[PosRaqueta][3] > 0) {
			spanDropshot.classList.add("suma");
		}
		if (raquetas[PosRaqueta][3] < 0) {
			spanDropshot.classList.add("resta");
		}
	let spanSpeed = document.getElementById("span-speed" + num);
	if (raquetas[PosRaqueta][4] != 0) spanSpeed.innerHTML = raquetas[PosRaqueta][4];
		if (raquetas[PosRaqueta][4] > 0) {
			spanSpeed.classList.add("suma");
		}
		if (raquetas[PosRaqueta][4] < 0) {
			spanSpeed.classList.add("resta");
		}
	let spanStamina = document.getElementById("span-stamina" + num);
	if (raquetas[PosRaqueta][5] != 0) spanStamina.innerHTML = raquetas[PosRaqueta][5];
		if (raquetas[PosRaqueta][5] > 0) {
			spanStamina.classList.add("suma");
		}
		if (raquetas[PosRaqueta][5] < 0) {
			spanStamina.classList.add("resta");
		}
	let spanService = document.getElementById("span-service" + num);
	if (raquetas[PosRaqueta][6] != 0) spanService.innerHTML = raquetas[PosRaqueta][6];
		if (raquetas[PosRaqueta][6] > 0) {
			spanService.classList.add("suma");
		}
		if (raquetas[PosRaqueta][6] < 0) {
			spanService.classList.add("resta");
		}
	let spanPower = document.getElementById("span-power" + num);
	if (raquetas[PosRaqueta][7] != 0) spanPower.innerHTML = raquetas[PosRaqueta][7];
		if (raquetas[PosRaqueta][7] > 0) {
			spanPower.classList.add("suma");
		}
		if (raquetas[PosRaqueta][7] < 0) {
			spanPower.classList.add("resta");
		}
	let spanResto = document.getElementById("span-resto" + num);
	if (raquetas[PosRaqueta][8] != 0) spanResto.innerHTML = raquetas[PosRaqueta][8];
		if (raquetas[PosRaqueta][8] > 0) {
			spanResto.classList.add("suma");
		}
		if (raquetas[PosRaqueta][8] < 0) {
			spanResto.classList.add("resta");
		}
	let spanConsi = document.getElementById("span-consistencia" + num);
	if (raquetas[PosRaqueta][9] != 0) spanConsi.innerHTML = raquetas[PosRaqueta][9];
		if (raquetas[PosRaqueta][9] > 0) {
			spanConsi.classList.add("suma");
		}
		if (raquetas[PosRaqueta][9] < 0) {
			spanConsi.classList.add("resta");
		}
}