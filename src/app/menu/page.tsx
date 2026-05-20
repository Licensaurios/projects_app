"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./VotacionPage.module.css";

// ── Reemplaza esta URL con la de tu Google Form ──────────────────────────────
const GOOGLE_FORM_URL = "https://forms.google.com/TU_FORMULARIO_AQUI";

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  stand: string;
  equipo: string;
  img: string | null;
}

const PROYECTOS: Proyecto[] = [
  { id: "6c457b5d", nombre: "Guante Traductor Sign to Text", descripcion: "Prototipo funcional capaz de traducir en tiempo real el lenguaje de señas al idioma español mediante una app Android.", categoria: "Tecnología", stand: "01", equipo: "Aboytes Mena Juan Jaime", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/01.jpeg" },
  { id: "132344ee", nombre: "Automatic Assistance", descripcion: "Optimiza y moderniza el pase de lista mediante la automatización del registro de asistencia para docentes.", categoria: "Tecnología", stand: "02", equipo: "López Navares Mario David", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/02.jpeg" },
  { id: "3e25a4e6", nombre: "Sistema de Asistencia de la Biblioteca", descripcion: "Automatiza el proceso de registro de visitas de alumnos, maestros y externos a la biblioteca.", categoria: "Tecnología", stand: "03", equipo: "Aréchiga Miranda Ian Ricardo", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/03.jpeg" },
  { id: "0ff17d8a", nombre: "Detección de Ruido en Biblioteca", descripcion: "Dispositivo portátil que identifica notas musicales en tiempo real y las muestra visualmente en un juego interactivo.", categoria: "Tecnología", stand: "04", equipo: "Alcaraz Pérez Flérida Romina", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/04.jpeg" },
  { id: "97369942", nombre: "Lumina Vision", descripcion: "Lentes inteligentes para personas con discapacidad visual con visión artificial y sensores ultrasónicos en Raspberry Pi 4.", categoria: "Innovación Social", stand: "05", equipo: "Acosta Maro Alan Josué", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/05.png" },
  { id: "9c893f85", nombre: "Sistema Gestor de Equipos Electrónicos", descripcion: "Sistema con sensores de peso, luces LED y ESP32 para automatizar el registro de préstamos y devoluciones.", categoria: "Tecnología", stand: "06", equipo: "Aguallo Gil José Manuel", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/06.jpeg" },
  { id: "f2124479", nombre: "Dispensador de Agua Automático", descripcion: "Dispensador con validación NIP y sistema de reciclaje que detecta botellas PET y monitorea saldo.", categoria: "Medio Ambiente", stand: "07", equipo: "Córtez Hernández Christian Armando", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/07.jpeg" },
  { id: "3c3a114b", nombre: "Sistema de Incentivos para Alimentación Saludable", descripcion: "Sistema digital de recompensas que motiva a niños de primaria a adoptar hábitos saludables con puntos canjeables.", categoria: "Salud", stand: "08", equipo: "Fernández Félix Fabiola", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/08.jpeg" },
  { id: "5cdb5c78", nombre: "Sistema de Control de Acceso RFID", descripcion: "Solución para controlar el acceso a áreas de almacenamiento y laboratorios mediante tecnología RFID.", categoria: "Tecnología", stand: "09", equipo: "Bojórquez Cárdenas Libni Magdiel", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/09.jpeg" },
  { id: "6b672928", nombre: "Boya Inteligente Guardián de Salud", descripcion: "Analiza la calidad del agua donde los estudiantes de natación practican para garantizar su seguridad.", categoria: "Salud", stand: "10", equipo: "Barrza Quintana Adrián", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/10.jpeg" },
  { id: "406c3dfb", nombre: "Convertidor a Pizarrón Virtual", descripcion: "Sistema encargado de convertir un pizarrón tradicional en un pizarrón virtual interactivo.", categoria: "Educación", stand: "11", equipo: "Leyva Banda Ángel Yamil", img: null },
  { id: "47b5c15a", nombre: "Octialfabeto", descripcion: "Brazo robótico articulado para enseñanza de escritura en preescolar mediante interfaz de software.", categoria: "Educación", stand: "12", equipo: "Castro Sepúlveda Jesús Alfonso", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/12.jpg" },
  { id: "05c0a191", nombre: "Sistema de Seguridad en la Escuela", descripcion: "Automatiza el control de acceso con registro en base de datos y control de espacios en estacionamiento.", categoria: "Tecnología", stand: "13", equipo: "Ávila Davizón Miguel Ángel", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/13.jpeg" },
  { id: "2af89ac6", nombre: "Todos Leemos", descripcion: "Sistema digital interactivo para apoyar el aprendizaje de lectura en niños con dificultades.", categoria: "Educación", stand: "14", equipo: "Carranza Ibarra Vanya", img: null },
  { id: "bb7c3094", nombre: "Sistema Inteligente de Control Vehicular", descripcion: "Sistema digital de control de acceso vehicular a la facultad.", categoria: "Tecnología", stand: "15", equipo: "Flores Gaxiola Gael", img: null },
  { id: "ce980ec2", nombre: "Sistema de Detección de Aprendizaje Infantil", descripcion: "Sistema para la detección de los estilos de aprendizaje en niños de preescolar y primaria.", categoria: "Educación", stand: "16", equipo: "Buelna Bojórquez Ángel Andrés", img: null },
  { id: "3ae0c683", nombre: "AulaBraille", descripcion: "Cámara que captura el contenido del pizarrón y lo traduce al sistema Braille mediante una impresora especializada.", categoria: "Innovación Social", stand: "17", equipo: "Becerra Apodaca Juan Antonio", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/17.png" },
  { id: "75611e93", nombre: "ZARA", descripcion: "Sistema embebido de asistencia educativa en primaria potenciado por IA para resolver dudas de los alumnos.", categoria: "Educación", stand: "18", equipo: "Camberos Cerecer Erick Ricardo", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/18.png" },
  { id: "09a507ca", nombre: "Sistema Gestor de Préstamos", descripcion: "Sistema de fiscalización y automatización de préstamo de equipos tecnológicos.", categoria: "Tecnología", stand: "19", equipo: "Armendariz Gastelúm Daniel Ulises", img: null },
  { id: "fcc2bd02", nombre: "Sistema de Seguridad", descripcion: "Cámara de seguridad que detecta apertura de puertas, toma foto y envía notificación al encargado.", categoria: "Tecnología", stand: "20", equipo: "Acosta Roiz Miguel Ángel", img: null },
  { id: "f2516fb6", nombre: "Pluma Lectora Inteligente", descripcion: "Herramienta accesible para personas con discapacidad visual que permite acceder a textos impresos.", categoria: "Innovación Social", stand: "21", equipo: "Aispuro Cuevas José Eduardo", img: null },
  { id: "20714943", nombre: "Sistema de Control y Préstamos Educativos", descripcion: "Automatiza el proceso de préstamo y devolución de equipo deportivo en una institución educativa.", categoria: "Tecnología", stand: "22", equipo: "Delgado Villareal Carlos Daniel", img: null },
  { id: "e2a30c8f", nombre: "Sistema de Asistencia", descripcion: "Sistema que registra la asistencia automáticamente y envía notificaciones relacionadas.", categoria: "Tecnología", stand: "23", equipo: "Haro Perea Johan Alan", img: null },
  { id: "37909ea2", nombre: "Sistema Smart de Material Docente", descripcion: "Evaluación para detección temprana de dificultades en discriminación cromática y herramienta de enseñanza.", categoria: "Educación", stand: "24", equipo: "Chaparro Padilla Ángela del Rosario", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/24.jpeg" },
  { id: "9e1e074e", nombre: "AutoMalla", descripcion: "Control automatizado de malla con sensores ambientales para cubrir una cancha deportiva según clima.", categoria: "Tecnología", stand: "25", equipo: "Ibarra García Samuel", img: null },
  { id: "9507bfad", nombre: "Sistema Digital Traductor Braille", descripcion: "Sistema capaz de traducir texto en español a Braille en tiempo real.", categoria: "Innovación Social", stand: "26", equipo: "Cota Osuna Saúl", img: null },
  { id: "ec8776f1", nombre: "A9 Robot Interactivo", descripcion: "Robot para aprendizaje de vocales y números mediante juegos interactivos con puntuación.", categoria: "Educación", stand: "27", equipo: "Castillo Ontiveros Fernando", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/27.jpeg" },
  { id: "53c76b76", nombre: "Sistema de Control de Préstamo Escolar", descripcion: "Sistema digital automático para registrar préstamos y devoluciones de materiales escolares.", categoria: "Tecnología", stand: "28", equipo: "Flores Quintero Roberto", img: null },
  { id: "e99e4e94", nombre: "Sistema de Detección de Gases", descripcion: "Monitoreo de calidad del aire en laboratorios con ventilación y alerta automática al detectar riesgo.", categoria: "Medio Ambiente", stand: "29", equipo: "Bacasegua Gastélum Emmanuel", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/29.jpeg" },
  { id: "86f314c7", nombre: "Máquina Expendedora Inteligente", descripcion: "Máquina expendedora de productos para estudiantes.", categoria: "Tecnología", stand: "30", equipo: "Chaparro Espinoza Santiago", img: null },
  { id: "e5799f20", nombre: "Caja Pomodoro", descripcion: "Sistema con cerradura electrónica para mantener a estudiantes enfocados eliminando el acceso a distractores.", categoria: "Educación", stand: "31", equipo: "López Pérez César Alejandro", img: "https://oyisncctlzhbxgfjtarj.supabase.co/storage/v1/object/public/imagenes/31.jpg" },
  { id: "62bad4eb", nombre: "Sistema de Monitoreo de Humedad Agronómica", descripcion: "Monitoreo y alerta temprana de humedad del suelo para entornos agrícolas con notificación visual y audible.", categoria: "Medio Ambiente", stand: "32", equipo: "Salguero Barreras Herly Saidd", img: null },
];

// ── Subcomponentes ────────────────────────────────────────────────────────────

function ImagenProyecto({ src, alt, className }: { src: string | null; alt: string; className: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }
  return (
    <div className={styles.imagen_placeholder}>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <line x1="3" y1="3" x2="21" y2="21" />
        <path d="M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-5" />
        <path d="M14.272 10.713a2 2 0 0 1 -3.986 .574" />
        <path d="M3 9v7a2 2 0 0 0 2 2h4" />
      </svg>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function VotacionPage() {
  const [indiceActual, setIndiceActual] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = PROYECTOS.length;

  const abrirFormulario = () => {
    window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer");
  };

  const irA = useCallback(
    (idx: number) => {
      setIndiceActual((idx + total) % total);
      setProgreso(0);
    },
    [total]
  );

  const reiniciarTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgreso(0);
    timerRef.current = setInterval(() => {
      setProgreso((prev) => {
        const siguiente = prev + (30 / 4000) * 100;
        return siguiente >= 100 ? 100 : siguiente;
      });
    }, 30);
  }, []);

  // Avance automático cuando el progreso llega a 100
  useEffect(() => {
    if (progreso >= 100) {
      irA(indiceActual + 1);
    }
  }, [progreso, indiceActual, irA]);

  // Arrancar el timer al montar
  useEffect(() => {
    reiniciarTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reiniciarTimer]);

  const handlePrev = () => {
    irA(indiceActual - 1);
    reiniciarTimer();
  };

  const handleNext = () => {
    irA(indiceActual + 1);
    reiniciarTimer();
  };

  const proyectoActual = PROYECTOS[indiceActual];

  return (
    <div className={styles.contenedor}>
      {/* ── Encabezado ── */}
      <header className={styles.encabezado}>
        <h1 className={styles.titulo_principal}>EXPOSICIÓN SISTEMAS DIGITALES</h1>
        <p className={styles.subtitulo}>Selecciona tu proyecto favorito y vota</p>
      </header>

      {/* ── Carrusel ── */}
      <section className={styles.seccion_carrusel} aria-label="Carrusel de proyectos">
        <button className={styles.boton_flecha} onClick={handlePrev} aria-label="Proyecto anterior">
          &#10094;
        </button>

        <div className={styles.tarjeta_carrusel}>
          {/* Imagen */}
          <div className={styles.zona_imagen_carrusel}>
            <ImagenProyecto
              src={proyectoActual.img}
              alt={proyectoActual.nombre}
              className={styles.imagen_carrusel}
            />
          </div>

          {/* Cuerpo */}
          <div className={styles.cuerpo_carrusel}>
            <span className={styles.badge}>
              {proyectoActual.categoria} · Stand {proyectoActual.stand}
            </span>
            <h2 className={styles.nombre_carrusel}>{proyectoActual.nombre}</h2>
            <p className={styles.descripcion_carrusel}>{proyectoActual.descripcion}</p>
            <p className={styles.equipo_carrusel}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}>
                <circle cx="12" cy="7" r="4" /><path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
              </svg>
              {proyectoActual.equipo}
            </p>
            <button className={styles.boton_votar_grande} onClick={abrirFormulario}>
              VOTAR POR ESTE PROYECTO ↗
            </button>
          </div>
        </div>

        <button className={styles.boton_flecha} onClick={handleNext} aria-label="Proyecto siguiente">
          &#10095;
        </button>
      </section>

      {/* ── Navegación: puntos y barra ── */}
      <div className={styles.navegacion_inferior}>
        <div className={styles.puntos} role="tablist" aria-label="Indicadores de proyecto">
          {PROYECTOS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === indiceActual}
              aria-label={`Proyecto ${i + 1}`}
              className={`${styles.punto} ${i === indiceActual ? styles.punto_activo : ""}`}
              onClick={() => { irA(i); reiniciarTimer(); }}
            />
          ))}
        </div>
        <div className={styles.barra_progreso} aria-hidden="true">
          <div className={styles.relleno_progreso} style={{ width: `${progreso}%` }} />
        </div>
      </div>

      <hr className={styles.divisor} />

      {/* ── Cuadrícula de todos los proyectos ── */}
      <section aria-label="Todos los proyectos">
        <h2 className={styles.titulo_seccion}>TODOS LOS PROYECTOS</h2>
        <div className={styles.cuadricula}>
          {PROYECTOS.map((proyecto) => (
            <article key={proyecto.id} className={styles.tarjeta_mini}>
              <div className={styles.zona_imagen_mini}>
                <ImagenProyecto
                  src={proyecto.img}
                  alt={proyecto.nombre}
                  className={styles.imagen_mini}
                />
              </div>
              <div className={styles.cuerpo_mini}>
                <h3 className={styles.nombre_mini}>{proyecto.nombre}</h3>
                <div className={styles.meta_mini}>
                  <span>Stand {proyecto.stand}</span>
                  <span>{proyecto.categoria}</span>
                </div>
                <button className={styles.boton_votar_mini} onClick={abrirFormulario}>
                  VOTAR ↗
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}