// Una partida jugada: quién, cuántos puntos, cuándo y cuánto tardó.
class Partida {
  constructor(nombre, puntos, total, fecha, segundos, modo = "normal") {
    this.nombre = nombre;
    this.puntos = puntos;
    this.total = total;
    this.fecha = fecha;          // texto en formato ISO, por ejemplo "2026-03-15T12:00:00.000Z"
    this.segundos = segundos;
    this.modo = modo;
  }

  porcentaje() {
    return Math.round(this.puntos / this.total * 100);
  }

  resumen() {
    return this.nombre + ": " + this.puntos + "/" + this.total + " (" + this.porcentaje() + " %) · " +
           formatearFecha(this.fecha) + " · " + this.segundos + " s" +
           (this.modo === "contrarreloj" ? " · Contrarreloj" : "");
  }
}

function formatearFecha(textoISO) {
  const f = new Date(textoISO);
  return f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
}

// Las partidas se guardan en una cookie como un array en JSON.
function cargarPartidas() {
  const datos = leerCookie("partidas", []);
  if (!Array.isArray(datos)) {
    console.error("La cookie de partidas no contiene un array.");
    return [];
  }
  return datos.map(p => new Partida(p.nombre, p.puntos, p.total, p.fecha, p.segundos, p.modo));
}

function guardarPartida(partida) {
  const partidas = cargarPartidas();
  partidas.push(partida);
  guardarCookie("partidas", partidas.slice(-5), 30);
}

function mediaPuntos(partidas) {
  if (partidas.length === 0) return 0;
  return partidas.reduce((suma, p) => suma + p.puntos, 0) / partidas.length;
}
