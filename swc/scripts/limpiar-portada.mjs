// Genera public/hero/portada.jpg a partir de la foto original de la portada:
// tapa la pantalla de la tablet (traía datos de prueba) y recomprime a JPEG.
// Encima, desde lg, la portada dibuja el panel limpio (components/demo/PanelOperativoDemo.tsx)
// alineado al rectángulo PORTADA.pantalla de lib/demo.ts.
//
// La original (final.png, con datos de prueba) ya no está en public/ para que no se publique.
// Se recupera del historial de git:
//   git show 6dc49af:swc/public/hero/final.png > ../final.png
//   node scripts/limpiar-portada.mjs ../final.png
// (sharp viene con Next; no es dependencia nueva)
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("uso: node scripts/limpiar-portada.mjs <ruta a final.png>");
  process.exit(1);
}
const out = "public/hero/portada.jpg";

// Vidrio de la tablet en coordenadas de la imagen (1672×941), medido a mano sobre final.png.
const vidrio = `<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941">
  <path d="M670 222 Q670 206 686 206 L1582 206 Q1598 206 1598 222 L1599 808 Q1599 824 1583 824 L678 822 Q662 822 662 806 Z" fill="rgb(11,12,15)"/>
</svg>`;

await sharp(src)
  .composite([{ input: Buffer.from(vidrio) }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(out);

console.log(`listo: ${out}`);
