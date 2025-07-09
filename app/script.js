/*
Código propio para el input file
*/
$(".custom-file-input").on("change", function () {
  let fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

const $imagen = document.querySelector("#archivo"),
  $imagenPrevisualizacion = document.querySelector("#imagenPrevisualizacion"),
  $btnDetectar = document.querySelector("#btnDetectar"),
  $estado = document.querySelector("#estado");

// Lista de palabras prohibidas
const palabrasProhibidas = [
  // Violencia y agresión
  'violencia', 'asesinato', 'matar', 'apuñalar', 'tiroteo', 'balacera',
  'ensangrentado', 'atropellado', 'golpiza', 'golpear',
  'agredir', 'arma', 'pistola', 'cuchillo', 'crimen', 'violento',

  // Drogas y alcohol
  'borracho', 'emborrachar', 'alcohol', 'cerveza', 'licor', 'narcos',
  'drogas', 'cocaína', 'marihuana', 'heroína', 'fumando', 'inhalando',

  // Lenguaje ofensivo o vulgar
  'grosería', 'insulto', 'estúpido', 'idiota', 'imbécil', 'maldito',
  'mierda', 'puta', 'perra', 'jodido', 'malnacido', 'desgraciado',

  // Acoso o amenazas
  'chantajeaba', 'amenaza', 'hostigar', 'intimidar',
  'acosar', 'extorsión', 'perseguir',

  // Contenido sexual explícito o inapropiado
  'pornografía', 'desnudo', 'desnuda', 'sexo', 'orgía', 'masturbación',
  'violación', 'prostituta', 'prostitución', 'lascivo', 'sensual',

  // Terrorismo y crimen organizado
  'terrorista', 'bomba', 'explosivo', 'sicario', 'cartel', 'criminal',
  'secuestro', 'rehenes', 'corrupción', 'lavado de dinero'
];

$imagen.addEventListener("change", () => {
  if (!$imagen.files || !$imagen.files.length) {
    $imagenPrevisualizacion.src = "";
    return;
  }
  const reader = new FileReader(),
    file = $imagen.files[0];
  reader.readAsDataURL(file);
  reader.onload = function () {
    $imagenPrevisualizacion.src = reader.result;
  };
});

$btnDetectar.addEventListener("click", () => {
  const archivos = $imagen.files;
  if (!archivos.length) return alert("No hay imágenes");

  const worker = new Tesseract.TesseractWorker();
  worker
    .recognize(archivos[0], 'spa')
    .progress(p => {
      $estado.innerHTML += <br><strong>Estado: ${p.status}</strong> (${p.progress * 100} % );
    })
    .then((result) => {
      const textoOriginal = result.text;
      const textoEnMinusculas = textoOriginal.toLowerCase();
      const detectadas = palabrasProhibidas.filter(palabra =>
        textoEnMinusculas.includes(palabra)
      );
      const edadSugerida = detectadas.length > 0 ? '12+' : '6+';

      // Resaltar palabras prohibidas en el texto detectado
      let textoResaltado = textoOriginal;
      palabrasProhibidas.forEach(palabra => {
        const regex = new RegExp((${palabra}), 'gi');
        textoResaltado = textoResaltado.replace(regex, <span class="resaltado">$1</span>);
      });

      $estado.innerHTML = `
    <strong>Texto detectado (con palabras resaltadas):</strong><br>
    <pre>${textoResaltado}</pre>
    <strong>Palabras prohibidas detectadas:</strong> ${detectadas.join(", ") || "Ninguna"}<br>
    <strong>Edad sugerida:</strong> ${edadSugerida}
  `;
    });
});
