var juego_finalizado;
var array_cartas = new Array (41);   /* Vector con las cartas de la baraja, ponemos 41 para utilizar del 1 al 40,
										según el valor de la carta y su palo, cada carta tiene un valor dentro del vector.
										He creado el vector en el que los bastos van del 1 al 10 según su valor,
										los oros del 11 al 20, las copas del 21 al 30 y las espadas del 31 al 40		*/
var card;
var suit;

function limpia_vector()		// Función que limpia el vector después de cada mano jugada
{
	for (i=0;i<41;i++){
		array_cartas[i]="";
	}
}

function no_repetida()		// Función que busca una carta no repetida
{	
	var sw=1;
	do
	{
		carta = barajar(9);		// Se saca un valor
		palo = sacapalo();		// Se saca un palo
		if (palo=="oros"){
			// Los "alert" fueron utilizados para realizar comprobaciones, por eso quedan comentados
			//alert("oros" + carta + "valor" + array_cartas[10+carta]);   
			if (array_cartas[10+carta] != "X")			/* Si la carta no se ha repartido aún la tacha en el vector 
														   y cambia el switch para salir luego del bucle   */
			{
				array_cartas[10+carta]="X";
				sw=0;
			}			
		}else if (palo=="copas"){
				//alert("copas" + carta + "valor" + array_cartas[20+carta]);
				if (array_cartas[20+carta] != "X")
				{
					array_cartas[20+carta]="X";
					sw=0;
				}
		}else if (palo=="espadas") {
				//alert("espadas" + carta + "valor" + array_cartas[30+carta]);
				if (array_cartas[30+carta] != "X")
				{
					array_cartas[30+carta]="X";
					sw=0;
				}
		}else{
			//alert("bastos" + carta + "valor" + array_cartas[carta]);
			if (array_cartas[carta] != "X")
			{
				array_cartas[carta]= "X";
				sw=0;
			}
		}
	}while(sw==1)		// Sale del bucle cuando la carta no se ha repartido ya anteriormente en la misma mano
	card=carta;			// Guardamos el valor de la carta y el palo para utilizarlo posteriormente
	suit=palo;
}	

function barajar(max)		// Función que saca un aleatorio y lo redondea a la baja, sumándole 1
{
	var num=Math.random()*max;		
	return Math.round(num)+1;
}
function sacapalo()		// Función que saca un aleatorio (1, 2, 3 o 4) y le asigna un palo de la baraja
{
	palo = barajar(4);		
	if(palo == 1) return "bastos";
	if(palo == 2) return "oros";
	if(palo == 3) return "copas";
	else return "espadas";
}
function repartir(quien)   
{
	no_repetida();		// Llama a la función no_repetida para sacar una carta nueva
	if(quien =="jugador")	// Si reparte la carta al jugador, se muestra en su casilla el nombre de la carta y su palo
		document.Juego.texto2.value=(nombre_carta(card) + " de " + suit);
	else				// Si reparte la carta a la banca, se muestra en su casilla el nombre de la carta y su palo
		document.Juego.texto1.value=(nombre_carta(card) + " de " + suit);
	return valor_carta(carta);
}
function nombre_carta(carta)	// Se le asigna nombre especial a la carta si es un As o una figura
{
	if(carta == 1) return "As";
	if(carta == 8) return "Sota";
	if(carta == 9) return "Caballo";
	if(carta == 10) return "Rey";
	return carta;
}
function valor_carta(carta)		// Se le asigna un valor a la carta, 1 al As, 0.5 a las figuras y su número al resto
{
	if(carta == 1) return 1;
	if(carta > 7) return 0.5; 
	return carta;
}

function nueva_mano(form)		//Función donde comienza el juego
{
	if(juego_finalizado != 0)	// Si no ha finalizado y se pulsa "Empezar"
	{
		form.texto1.value=("Termina la mano!");
		form.texto2.value=("");
		return;
	}
	else
	{
		
		form.banca.value = 0;		// Valor total de cartas se ponen a 0 
		form.jugador.value = 0;
		limpia_vector();			// Se "barajan" las cartas
		form.banca.value = repartir("banca");	 // Se le reparte la carta inicial a la banca
		form.jugador.value = repartir("jugador");	// Se le reparte la carta inicial al jugador
		juego_finalizado = 1;	
	}
}
function juega_banca(form)
{
	if (juego_finalizado == 0)		// Si la mano ha finalizado y se pulsa "Plantarse"		
		return;
	while(form.banca.value < form.jugador.value && form.banca.value < 7.5)		// Saca cartas mientras que tiene un valor inferior al del jugador y hasta 7.5
		form.banca.value = eval(form.banca.value) + repartir("banca");		// Se le suman cartas
}
function juega_jugador(form)		// Función que empieza al darle a "Una carta más"
{
	if (juego_finalizado == 0)		// Si ha finalizado la mano
	{
		form.texto1.value=("Reparte una");
		form.texto2.value=("nueva mano!");
		return;
	}
	else		// Si no había finalizado la mano
		form.jugador.value = eval(form.jugador.value) + repartir("jugador");		// Se le añade el valor de la carta repartida al jugador
	if(form.jugador.value > 7.5)		// Si se pasa de 7.5
	{
		form.texto1.value=("Te has pasado!");
		form.texto2.value=("Gana la banca");
		juego_finalizado=0;		// Fin de la mano
		form.victorias.value=eval(form.victorias.value) - 1;		// Derrota del jugador
	}
}
function busca_ganador(form)		// Función que busca un ganador si se pulsa "Plantarse"
{
	
	if (juego_finalizado == 0)		// Evita que sume más puntos si la partida a finalizado
	{
		form.texto1.value=("Reparte una");
		form.texto2.value=("nueva mano!");
		return;
	}
	if(form.banca.value > 7.5)		// Si la banca tiene más de 7.5 se pasó y pierde
	{
		form.texto1.value=("Ganaste!");
		form.texto2.value=("La banca se pasó");
		juego_finalizado = 0;
		form.victorias.value=eval(form.victorias.value) + 1;		// Victoria del jugador
	}
	else if(form.banca.value == form.jugador.value)		// Si banca y jugador empatan, gana la banca
	{
		form.texto1.value=("Juego empatado!");
		form.texto2.value=("Prueba otra vez!");
		juego_finalizado = 0;
		form.victorias.value=eval(form.victorias.value) - 1;
	}
	else		// En el caso de que la banca tenga mayor valor total sin pasarse de 7.5
	{
		form.texto1.value=("Gana la banca!");
		form.texto2.value=("Prueba de nuevo!");
		juego_finalizado = 0;
		form.victorias.value=eval(form.victorias.value) - 1;
	}
}
function sieteymedio()		// Inicializa la tabla
{
	var NombreJugador=window.prompt("Por favor introduce tu nombre:","Jugador")
	if (NombreJugador != null && NombreJugador != ""){
		document.getElementById("NombreJugador").innerHTML = NombreJugador;
	}
	juego_finalizado = 0;
	document.Juego.banca.value=""; 
	document.Juego.jugador.value="";
	document.Juego.victorias.value="0";
	document.Juego.texto1.value="Pulsa 'Empezar'";
	document.Juego.texto2.value="para comenzar!";
}