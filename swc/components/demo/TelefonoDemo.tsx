/* eslint-disable @next/next/no-img-element -- imágenes chicas dentro de pantallas dibujadas */
import type { ReactNode } from "react";
import { RECORRIDO_OT as OT } from "../../lib/demo";
import {
  AntennaBars,
  AntennaBarsOff,
  ArrowLeft,
  Battery,
  Bell,
  Camera,
  Check,
  CloudCheck,
  Truck,
  WifiOff,
} from "../ui/icons";
import s from "./TelefonoDemo.module.css";

/** Barra de estado del teléfono. Sin señal en el paso de terreno: la OT se crea igual. */
function Estado({ hora, conSenal }: { hora: string; conSenal: boolean }) {
  return (
    <div className={s.estado}>
      <span>{hora}</span>
      <span className={s.estadoIconos}>
        {conSenal ? <AntennaBars stroke={2} /> : <AntennaBarsOff stroke={2} />}
        <Battery stroke={2} />
      </span>
    </div>
  );
}

function Barra({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className={s.barra}>
      <ArrowLeft stroke={2} />
      <span>{titulo}</span>
      {children ?? (
        <span className={s.campana}>
          <Bell stroke={1.8} />
        </span>
      )}
    </div>
  );
}

/** Tarjeta de la OT recién creada. La sección del inicio la clona para que "viaje" al panel. */
function TarjetaOT() {
  return (
    <div className={s.tarjetaOT} data-vuelo-origen>
      <div className={s.tarjetaCab}>
        <span className={s.np}>{OT.tipo}</span>
        <b>{OT.codigo}</b>
        <span className={s.alta}>
          <i /> {OT.prioridad}
        </span>
      </div>
      <span className={s.tarjetaEquipo}>
        {OT.equipo} · {OT.modelo}
      </span>
      <span className={s.tarjetaFalla}>{OT.falla}</span>
      <div className={s.tarjetaPie}>
        <span className={s.pendiente}>Pendiente</span>
        <span>hace un momento</span>
      </div>
    </div>
  );
}

/**
 * Teléfono con la app de sworkc (datos de ejemplo de lib/demo.ts). Muestra cuatro pantallas y
 * la visible la decide el `data-paso` (0–3) de un ancestro: 0 escanear QR (captura real),
 * 1 nueva OT sin señal, 2 OT creada y enviada, 3 OT cerrada con evidencia y firma.
 * Diseño a 390 × 844; escala con el ancho del contenedor (cqw).
 */
export function TelefonoDemo() {
  return (
    <div
      className={s.telefono}
      role="img"
      aria-label={`Teléfono con la app de sworkc: se escanea el QR del ${OT.equipo}, se crea la ${OT.codigo} por «${OT.falla}» y se cierra con evidencia y firma. Datos de ejemplo.`}
    >
      <div className={s.cuerpo} aria-hidden>
        <div className={s.vidrio}>
          <span className={s.isla} />

          <div className={`${s.pantalla} ${s.p0}`}>
            <Estado hora="08:41" conSenal={false} />
            <img className={s.captura} src="/img/producto/escanear-qr.jpg" alt="" width={900} height={1948} loading="lazy" decoding="async" />
          </div>

          <div className={`${s.pantalla} ${s.p1}`}>
            <Estado hora="08:42" conSenal={false} />
            <Barra titulo="Nueva OT" />
            <div className={s.contenido}>
              <div className={s.aviso}>
                <WifiOff stroke={1.8} />
                Sin señal. La OT queda guardada en el teléfono y se envía sola al volver la cobertura.
              </div>
              <div className={s.equipo}>
                <span className={s.equipoIcono}>
                  <Truck stroke={1.7} />
                </span>
                <div>
                  <b>{OT.equipo}</b>
                  <span>
                    {OT.modelo} · {OT.flota}
                  </span>
                </div>
                <span className={s.porQR}>Por QR</span>
              </div>
              <span className={s.rotulo}>Tipo de OT</span>
              <div className={s.segmentado}>
                <span className={s.segActivoRojo}>NP</span>
                <span>PL</span>
                <span>CC</span>
              </div>
              <span className={s.rotulo}>Prioridad</span>
              <div className={s.segmentado}>
                <span>Baja</span>
                <span>Media</span>
                <span className={s.segActivoRojo}>Alta</span>
              </div>
              <span className={s.rotulo}>Descripción</span>
              <div className={s.campo}>{OT.falla}. Se detiene el equipo en la rampa 3.</div>
              <span className={s.rotulo}>Fotos</span>
              <div className={s.fotos}>
                <img src="/img/faena/caex-evidencia.jpg" alt="" width={480} height={240} loading="lazy" decoding="async" />
                <span className={s.fotoMas}>
                  <Camera stroke={1.7} />
                </span>
              </div>
            </div>
            <div className={s.boton}>Crear OT</div>
          </div>

          <div className={`${s.pantalla} ${s.p2}`}>
            <Estado hora="08:44" conSenal />
            <Barra titulo="OT creada" />
            <div className={`${s.contenido} ${s.centrado}`}>
              <span className={s.exito}>
                <Check stroke={2.4} />
              </span>
              <b className={s.exitoTitulo}>OT creada y enviada</b>
              <span className={s.exitoTexto}>Mantención ya la ve en el panel.</span>
              <TarjetaOT />
              <span className={s.sincronizada}>
                <CloudCheck stroke={1.8} /> Sincronizada al recuperar señal
              </span>
            </div>
            <div className={`${s.boton} ${s.botonSecundario}`}>Ver OT</div>
          </div>

          <div className={`${s.pantalla} ${s.p3}`}>
            <Estado hora="11:06" conSenal />
            <Barra titulo={OT.codigo}>
              <span className={s.cerrada}>Cerrada</span>
            </Barra>
            <div className={s.contenido}>
              <span className={s.rotulo}>Trabajo realizado</span>
              <div className={s.campo}>{OT.trabajo}</div>
              <span className={s.rotulo}>Checklist</span>
              <ul className={s.checklist}>
                {OT.checklist.map((c) => (
                  <li key={c}>
                    <Check stroke={2.6} />
                    {c}
                  </li>
                ))}
              </ul>
              <span className={s.rotulo}>Evidencia</span>
              <div className={s.fotos}>
                <img src="/img/faena/caex-evidencia.jpg" alt="" width={480} height={240} loading="lazy" decoding="async" />
                <img className={s.fotoDetalle} src="/img/faena/caex-evidencia.jpg" alt="" width={480} height={240} loading="lazy" decoding="async" />
              </div>
              <span className={s.rotulo}>Firma</span>
              <div className={s.firma}>
                <svg viewBox="0 0 200 60">
                  <path
                    className={s.trazo}
                    pathLength={1}
                    d="M8 42 C 22 12, 34 58, 48 30 S 70 14, 80 38 S 96 52, 108 26 S 128 18, 134 40 C 140 50, 150 30, 164 34 S 182 40, 192 30"
                  />
                </svg>
                <span>{OT.cerradaPor}</span>
              </div>
              <div className={s.resumen}>
                <span>Reparación</span>
                <b>{OT.reparacion}</b>
              </div>
            </div>
            <div className={`${s.boton} ${s.botonListo}`}>
              <Check stroke={2.4} /> OT cerrada
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
