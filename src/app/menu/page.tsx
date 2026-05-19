"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import estilos from './menu.module.css';

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  numero_stand: string;
  equipo_responsable: string;
  url_imagen: string[];
  activo: boolean;
  created_at: string;
}

export default function PaginaMenu() {
  const [lista_proyectos, set_lista_proyectos] = useState<Proyecto[]>([]);
  const [indice_actual, set_indice_actual] = useState(0);
  const [progreso_barra, set_progreso_barra] = useState(0);
  const [menu_abierto, set_menu_abierto] = useState(false);
  
  const total_proyectos = lista_proyectos.length;
  const alternar_menu = () => set_menu_abierto(!menu_abierto);
  const referencias_cartas = useRef<(HTMLElement | null)[]>([]);

  const lista_categorias = [
    { id_categoria: "software", nombre_categoria: "Software" },
    { id_categoria: "hardware", nombre_categoria: "Hardware" },
    { id_categoria: "innovador", nombre_categoria: "Innovador" }

  ];

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data: Proyecto[]) => {
        const proyectos_activos = data.filter((proyecto: Proyecto) => proyecto.activo);
        set_lista_proyectos(proyectos_activos);
      })
      .catch((err) => {
        console.error("Error consultando la base de datos de proyectos:", err);
      });
  }, []);

  const ir_siguiente = () => {
    if (total_proyectos === 0) return;
    set_indice_actual((prev) => (prev + 1) % total_proyectos);
    set_progreso_barra(0);
  };

  const ir_anterior = () => {
    if (total_proyectos === 0) return;
    set_indice_actual((prev) => (prev - 1 + total_proyectos) % total_proyectos);
    set_progreso_barra(0);
  };

  useEffect(() => {
    if (total_proyectos === 0) return;

    const tiempo_total = 3000;
    const intervalo = 30;
    const incremento = (intervalo / tiempo_total) * 100;

    const temporizador = setInterval(() => {
      set_progreso_barra((prev) => {
        if (prev >= 100) return 100;
        return prev + incremento;
      });
    }, intervalo);

    return () => clearInterval(temporizador);
  }, [indice_actual, total_proyectos]);

  useEffect(() => {
    if (progreso_barra >= 100) {
      ir_siguiente();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progreso_barra]);

  useEffect(() => {
    if (total_proyectos === 0) return;

    const observador_scroll = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            if (estilos.visible) {
              entrada.target.classList.add(estilos.visible);
            } else {
              const elemento = entrada.target as HTMLElement;
              elemento.style.opacity = '1';
              elemento.style.transform = 'translateY(0)';
              elemento.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            }
            observador_scroll.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    referencias_cartas.current.forEach((carta) => {
      if (carta) observador_scroll.observe(carta);
    });

    return () => observador_scroll.disconnect();
  }, [lista_proyectos, total_proyectos]); 

  const obtener_clase_posicion = (indice_carta: number) => {
    if (total_proyectos === 0) return estilos.carta_oculta;
    if (indice_carta === indice_actual) return estilos.carta_centro;
    if (indice_carta === (indice_actual - 1 + total_proyectos) % total_proyectos) return estilos.carta_izquierda;
    if (indice_carta === (indice_actual + 1) % total_proyectos) return estilos.carta_derecha;
    return estilos.carta_oculta;
  };

  return (
    <div className={estilos.contenedor_principal}>
      <nav className={estilos.barra_navegacion}>
        <div className={estilos.contenedor_logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/4.png" alt="Logo Votación Proyectos" className={estilos.imagen_logo} />
        </div>

        <button 
          className={`${estilos.boton_hamburguesa} ${menu_abierto ? estilos.abierto : ''}`} 
          onClick={alternar_menu}
        >
          <div className={estilos.linea_hamburguesa} />
          <div className={estilos.linea_hamburguesa} />
          <div className={estilos.linea_hamburguesa} />
        </button>

        <div 
          className={`${estilos.fondo_oscuro} ${menu_abierto ? estilos.activo : ''}`}
          onClick={alternar_menu}
        />

        <div className={`${estilos.enlaces_navegacion} ${menu_abierto ? estilos.menu_activo : ''}`}>
          <Link href="#categorias" className={estilos.enlace_item} onClick={alternar_menu}>CATEGORÍAS</Link>
          <Link href="#proyectos" className={estilos.enlace_item} onClick={alternar_menu}>PROYECTOS</Link>
        </div>
      </nav>
      <hr />
      <h1 className={estilos.titulo_seccion}>EXPOSICIÓN DE PROYECTOS SISTEMAS DIGITALES</h1>

      <div className={estilos.zona_interactiva}>
        <button className={estilos.boton_flecha} onClick={ir_anterior}>
          &#10094;
        </button>

        <div className={estilos.contenedor_cartas}>
          {lista_proyectos.map((proyecto, indice) => (
            <Link 
              href={`/proyecto/${proyecto.id}`} 
              key={proyecto.id} 
              className={`${estilos.carta_base} ${obtener_clase_posicion(indice)}`}
              style={{ textDecoration: 'none' }}
            >
              <div className={estilos.zona_imagen}>
                {proyecto.url_imagen && proyecto.url_imagen.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={proyecto.url_imagen[0]} alt={proyecto.nombre} className={estilos.imagen_proyecto} />
                ) : (
                  <div className={estilos.imagen_proyecto} style={{ backgroundColor: '#eee' }}></div>
                )}
              </div>
              
              <div className={estilos.zona_texto}>
                <h2 className={estilos.nombre_proyecto}>{proyecto.nombre}</h2> 
                <p className={estilos.detalle_proyecto}>
                  <span className={estilos.etiqueta_stand}>Stand:</span> {proyecto.numero_stand} 
                </p>
                <p className={estilos.detalle_proyecto}>
                  <strong>Integrantes:</strong> {proyecto.equipo_responsable} 
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button className={estilos.boton_flecha} onClick={ir_siguiente}>
          &#10095;
        </button>
      </div>

      <div className={estilos.zona_inferior}>
        <div className={estilos.pista_progreso}>
          <div 
            className={estilos.relleno_progreso} 
            style={{ width: `${progreso_barra}%` }} 
          />
        </div>

        <Link href="/vote" className={estilos.boton_votar}>
          IR A VOTAR
        </Link>
      </div>

      <section id="categorias" className={estilos.seccion_categorias}>
        <h2 className={estilos.titulo_seccion}>CATEGORIAS</h2>
        <div className={estilos.cuadricula_categorias}>
          {lista_categorias.map((categoria) => (
            <div key={categoria.id_categoria} className={estilos.tarjeta_categoria}>
              {categoria.nombre_categoria}
            </div>
          ))}
        </div>
      </section>

      <section id="proyectos" className={estilos.seccion_todos_proyectos}>
        <h2 className={estilos.titulo_seccion}>TODOS LOS PROYECTOS</h2>
        
        <div className={estilos.cuadricula_proyectos}>
          {lista_proyectos.map((proyecto, indice) => (
            <article 
              key={proyecto.id} 
              className={estilos.tarjeta_pequena}
              ref={(elemento) => {
                referencias_cartas.current[indice] = elemento;
              }}
            >
              <Link href={`/proyecto/${proyecto.id}`} className={estilos.enlace_tarjeta_completa}>
                <div className={estilos.imagen_pequena}>
                  {proyecto.url_imagen && proyecto.url_imagen.length > 0 ? ( 
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={proyecto.url_imagen[0]} alt={proyecto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}></div>
                  )}
                </div>
                
                <div className={estilos.cuerpo_tarjeta_pequena}>
                  <h3 className={estilos.titulo_pequeno}>{proyecto.nombre}</h3>
                  
                  <div className={estilos.pie_tarjeta_pequena}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>Stand {proyecto.numero_stand}</span>
                    <span style={{ color: '#888', fontWeight: 'bold' }}>{proyecto.categoria}</span> {/* [cite: 14] */}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}