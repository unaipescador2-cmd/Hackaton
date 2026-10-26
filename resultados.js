// Ventana de resultados: lee la cookie de partidas que guardó la página principal.
function pintarResultados() {
  const partidas = cargarPartidas();
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = "";
  for (const p of partidas) {
    const fila = document.createElement("tr");
    const textos = [
      p.nombre,
      p.puntos + "/" + p.total,
      p.porcentaje() + " %",
      formatearFecha(p.fecha),
      p.modo === "contrarreloj" ? "Contrarreloj" : "Normal"
    ];
    for (const texto of textos) {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    }
    tabla.appendChild(fila);
  }
  document.getElementById("mediaRes").textContent =
    partidas.length > 0 ? "Media: " + mediaPuntos(partidas).toFixed(1) + " puntos" : "Aún no hay partidas.";
}
document.addEventListener("DOMContentLoaded", pintarResultados);
