// Banco de preguntas. Cada pregunta es un objeto:
//   pregunta: el enunciado · opciones: array de 4 textos · correcta: posición de la opción correcta
const PREGUNTAS = [
  { pregunta: "¿Qué etiqueta HTML crea un enlace?", opciones: ["<a>", "<link>", "<href>", "<url>"], correcta: 0 },
  { pregunta: "¿Qué propiedad CSS cambia el color del texto?", opciones: ["font-color", "color", "text-color", "foreground"], correcta: 1 },
  { pregunta: "¿Qué método añade un elemento al final de un array?", opciones: ["push", "pop", "shift", "add"], correcta: 0 },
  { pregunta: "¿Qué devuelve typeof []?", opciones: ["\"array\"", "\"object\"", "\"list\"", "\"undefined\""], correcta: 1 },
  { pregunta: "¿Qué objeto representa la página web que se está mostrando?", opciones: ["window", "document", "navigator", "location"], correcta: 1 },
  { pregunta: "¿Qué función convierte un objeto en texto JSON?", opciones: ["JSON.parse", "JSON.stringify", "JSON.text", "JSON.string"], correcta: 1 },
  { pregunta: "¿Cuántos segundos tiene un día?", opciones: ["1440", "3600", "86400", "24000"], correcta: 2 },
  { pregunta: "¿Qué atributo de una cookie indica cuánto tiempo dura?", opciones: ["expires-in", "max-age", "lifetime", "time"], correcta: 1 }
];
