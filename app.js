// QuizDAW · lógica de la página
let usuario = null;
let preguntas = [];
let indice = 0;
let puntos = 0;
let inicio = 0;
let respondida = false;
let modoContrarreloj = false;
let temporizador = null;
let segundosRestantes = 30;
let partidaTerminada = false;

/* ---------- Usuario y apariencia ---------- */
function pedirNombre() {
  const nombre = prompt("¿Cómo te llamas?");
  return nombre ? nombre.trim() || "invitado" : "invitado";
}

function aplicarTema() {
  document.body.classList.toggle("oscuro", usuario.tema === "oscuro");
}

function cambiarTema() {
  usuario.tema = usuario.tema === "oscuro" ? "claro" : "oscuro";
  guardarCookie("usuario", usuario, 30);
  aplicarTema();
}

/* ---------- Datos del navegador ---------- */
function datosDelNavegador() {
  return {
    ventana: window.innerWidth + " × " + window.innerHeight,
    idioma: navigator.language,
    pagina: document.title,
    ruta: location.pathname
  };
}

function pintarInfo() {
  const d = datosDelNavegador();
  document.getElementById("info").textContent =
    "Ventana: " + d.ventana + " · Idioma: " + d.idioma + " · Página: " + d.pagina + " · Ruta: " + d.ruta;
}

/* ---------- Preguntas al azar ---------- */
function elegirPreguntas(todas, cuantas) {
  const disponibles = [...todas];
  const elegidas = [];
  while (elegidas.length < Math.min(cuantas, todas.length)) {
    const posicion = Math.floor(Math.random() * disponibles.length);
    elegidas.push(disponibles.splice(posicion, 1)[0]);
  }
  return elegidas;
}

/* ---------- La partida ---------- */
function mostrarSeccion(id, visible) {
  document.getElementById(id).hidden = !visible;
}

function iniciarPartida() {
  if (temporizador !== null) clearInterval(temporizador);
  preguntas = elegirPreguntas(PREGUNTAS, 5);
  indice = 0;
  puntos = 0;
  inicio = Date.now();
  partidaTerminada = false;
  segundosRestantes = 30;
  mostrarSeccion("inicio", false);
  mostrarSeccion("final", false);
  mostrarSeccion("juego", true);
  const reloj = document.getElementById("temporizador");
  reloj.hidden = !modoContrarreloj;
  if (modoContrarreloj) {
    reloj.textContent = "Tiempo: " + segundosRestantes + " s";
    temporizador = setInterval(() => {
      segundosRestantes--;
      reloj.textContent = "Tiempo: " + segundosRestantes + " s";
      if (segundosRestantes <= 0) {
        clearInterval(temporizador);
        temporizador = null;
        terminar();
      }
    }, 1000);
  }
  mostrarPregunta();
}

function mostrarPregunta() {
  const q = preguntas[indice];
  respondida = false;
  document.title = "QuizDAW · " + (indice + 1) + "/" + preguntas.length;
  document.getElementById("textoPregunta").textContent = (indice + 1) + "/" + preguntas.length + " · " + q.pregunta;

  const contenedor = document.getElementById("opciones");
  contenedor.innerHTML = "";
  q.opciones.forEach((texto, i) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion";
    boton.textContent = texto;
    boton.dataset.i = i;
    contenedor.appendChild(boton);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("btnSiguiente").hidden = true;
  document.getElementById("marcador").textContent = "Puntos: " + puntos;
}

function manejarOpcion(evento) {
  const dato = evento.target.dataset.i;
  if (dato === undefined || respondida) return;
  responder(Number(dato));
}

function responder(i) {
  respondida = true;
  const q = preguntas[indice];
  const botones = document.getElementById("opciones").children;
  const acierto = i === q.correcta;
  if (acierto) puntos++;

  botones[q.correcta].className = "opcion ok";
  if (!acierto) botones[i].className = "opcion mal";
  document.getElementById("feedback").textContent =
    acierto ? "¡Correcto!" : "Incorrecto. La respuesta era: " + q.opciones[q.correcta];
  document.getElementById("marcador").textContent = "Puntos: " + puntos;

  const siguiente = document.getElementById("btnSiguiente");
  siguiente.textContent = indice === preguntas.length - 1 ? "Ver resultado" : "Siguiente";
  siguiente.hidden = false;
}

function siguiente() {
  indice++;
  if (indice < preguntas.length) mostrarPregunta();
  else terminar();
}

function terminar() {
  if (partidaTerminada) return;
  partidaTerminada = true;
  if (temporizador !== null) {
    clearInterval(temporizador);
    temporizador = null;
  }
  const segundos = Math.round((Date.now() - inicio) / 1000);
  const modo = modoContrarreloj ? "contrarreloj" : "normal";
  const partida = new Partida(usuario.nombre, puntos, preguntas.length, new Date().toISOString(), segundos, modo);
  guardarPartida(partida);

  mostrarSeccion("juego", false);
  mostrarSeccion("final", true);
  document.title = "QuizDAW";
  document.getElementById("textoFinal").textContent = partida.resumen();
  pintarPartidas();
}

/* ---------- Lista de partidas y ventana de resultados ---------- */
function pintarPartidas() {
  const partidas = cargarPartidas();
  const lista = document.getElementById("listaPartidas");
  lista.innerHTML = "";
  for (const p of partidas) {
    const li = document.createElement("li");
    li.textContent = p.resumen();
    lista.appendChild(li);
  }
  document.getElementById("media").textContent =
    partidas.length > 0 ? "Media: " + mediaPuntos(partidas).toFixed(1) + " puntos" : "Aún no hay partidas.";
}

function abrirResultados() {
  window.open("resultados.html", "resultados", "popup=yes,width=520,height=460");
}

function cambiarModoContrarreloj() {
  modoContrarreloj = !modoContrarreloj;
  document.getElementById("btnContrarreloj").textContent =
    modoContrarreloj ? "Desactivar contrarreloj" : "Activar contrarreloj (30 s)";
  document.getElementById("estadoModo").textContent =
    modoContrarreloj ? "Modo contrarreloj activado: tienes 30 segundos por partida." : "Modo normal activado.";
}

function manejarBorrar() {
  if (confirm("¿Borrar todos tus datos del quiz?")) {
    borrarCookie("usuario");
    borrarCookie("partidas");
    pintarPartidas();
    document.getElementById("saludo").textContent = "Datos borrados. Recarga la página.";
  }
}

/* ---------- Arranque ---------- */
function iniciar() {
  usuario = leerCookie("usuario", null);
  if (usuario === null) {
    usuario = { nombre: pedirNombre(), tema: "claro" };
    guardarCookie("usuario", usuario, 30);
  }
  document.getElementById("saludo").textContent = "Hola, " + usuario.nombre;
  aplicarTema();
  pintarPartidas();
  pintarInfo();

  document.getElementById("btnEmpezar").addEventListener("click", iniciarPartida);
  document.getElementById("btnOtra").addEventListener("click", iniciarPartida);
  document.getElementById("btnSiguiente").addEventListener("click", siguiente);
  document.getElementById("opciones").addEventListener("click", manejarOpcion);
  document.getElementById("btnTema").addEventListener("click", cambiarTema);
  document.getElementById("btnResultados").addEventListener("click", abrirResultados);
  document.getElementById("btnBorrar").addEventListener("click", manejarBorrar);
  document.getElementById("btnContrarreloj").addEventListener("click", cambiarModoContrarreloj);
}
document.addEventListener("DOMContentLoaded", iniciar);
