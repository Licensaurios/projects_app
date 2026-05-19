"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import estilos from '../proyecto.module.css';

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

export default function PantallaProyecto({ params }: { params: { id: string } }) {
  const [datos_proyecto, set_datos_proyecto] = useState<Proyecto | null>(null);
  const [indice_imagen, set_indice_imagen] = useState(0);
  const [cargando, set_cargando] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data: Proyecto[]) => {
        const proyecto_encontrado = data.find((item) => item.id === params.id);
        if (proyecto_encontrado) {
          set_datos_proyecto(proyecto_encontrado);
        }
        set_cargando(false);
      })
      .catch((err) => {
        console.error("Error cargando los detalles del proyecto:", err);
        set_cargando(false);
      });
  }, [params.id]);

  if (cargando) {
    return (
      <main className={estilos.pantalla_completa} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#888', fontWeight: '800' }}>Cargando datos del proyecto...</h2>
      </main>
    );
  }

  if (!datos_proyecto) {
    return (
      <main className={estilos.pantalla_completa} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ color: '#ff5043', fontWeight: '800' }}>Proyecto no encontrado</h2>
        <Link href="/menu" className={estilos.boton_regresar}>
          &#8592; VOLVER A LA EXPOSICIÓN
        </Link>
      </main>
    );
  }

  const total_imagenes = datos_proyecto.url_imagen ? datos_proyecto.url_imagen.length : 0;

  const ir_siguiente = () => {
    if (total_imagenes <= 1) return;
    set_indice_imagen((prev) => (prev + 1) % total_imagenes);
  };

  const ir_anterior = () => {
    if (total_imagenes <= 1) return;
    set_indice_imagen((prev) => (prev - 1 + total_imagenes) % total_imagenes);
  };

  const ir_a_imagen = (indice_especifico: number) => {
    set_indice_imagen(indice_especifico);
  };

  return (
    <main className={estilos.pantalla_completa}>
      
      <div className={estilos.contenedor_volver}>
        <Link href="/menu" className={estilos.boton_regresar}>
           &#8592; VOLVER
        </Link>
      </div>

      <section className={estilos.zona_galeria}>
        
        {total_imagenes > 1 && (
          <>
            <button onClick={ir_anterior} className={`${estilos.boton_carrusel} ${estilos.boton_izq}`}>
              &#10094;
            </button>
            <button onClick={ir_siguiente} className={`${estilos.boton_carrusel} ${estilos.boton_der}`}>
              &#10095;
            </button>
          </>
        )}

        {total_imagenes > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            key={indice_imagen} 
            src={datos_proyecto.url_imagen[indice_imagen]} 
            alt={`${datos_proyecto.nombre} - Imagen ${indice_imagen + 1}`} 
            className={estilos.imagen_destacada} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
        )}

        {total_imagenes > 1 && (
          <div className={estilos.contenedor_indicadores}>
            {datos_proyecto.url_imagen.map((_, indice) => (
              <div 
                key={indice}
                onClick={() => ir_a_imagen(indice)}
                className={`${estilos.punto_indicador} ${indice === indice_imagen ? estilos.punto_activo : ''}`}
              />
            ))}
          </div>
        )}
      </section>

      <section className={estilos.zona_contenido}>
        
        <div className={estilos.fila_etiquetas}>
          <span className={estilos.etiqueta_stand}>Stand {datos_proyecto.numero_stand}</span>
          <span style={{ color: '#888', fontWeight: '800' }}>Categoría: {datos_proyecto.categoria}</span>
        </div>

        <h1 className={estilos.titulo_proyecto}>{datos_proyecto.nombre}</h1>

        <div className={estilos.seccion_info}>
          <h3 className={estilos.subtitulo_info}>Integrantes</h3>
          <p className={estilos.texto_info}>{datos_proyecto.equipo_responsable}</p>
        </div>

        <div className={estilos.seccion_info}>
          <h3 className={estilos.subtitulo_info}>Descripción del proyecto</h3>
          <p className={estilos.texto_info}>{datos_proyecto.descripcion}</p>
        </div>

        <div className={estilos.zona_votar}>
          <Link href="/vote" className={estilos.boton_votar_gigante}>
            IR A VOTAR
          </Link>
        </div>

      </section>

    </main>
  );
}