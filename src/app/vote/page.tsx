"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import estilos from './vote.module.css';

// 1. Definimos la interfaz basada en el backend para evitar errores de TypeScript 
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

export default function PantallaVotacion() {
  const enrutador = useRouter();

  const lista_categorias = [
    { id_categoria: "software", nombre_categoria: "Software" },
    { id_categoria: "hardware", nombre_categoria: "Hardware" },
    { id_categoria: "innovador", nombre_categoria: "Innovador" }

  ];

  const [lista_proyectos, set_lista_proyectos] = useState<Proyecto[]>([]);
  
  const [votos, set_votos] = useState<{ [key: string]: string }>({});
  
  const [modal_abierto, set_modal_abierto] = useState(false);
  const [token_ingresado, set_token_ingresado] = useState('');
  const [estado_validacion, set_estado_validacion] = useState<'ocioso' | 'cargando' | 'exito' | 'error'>('ocioso');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data: Proyecto[]) => {
        const proyectos_activos = data.filter((proyecto: Proyecto) => proyecto.activo);
        set_lista_proyectos(proyectos_activos);
      })
      .catch((err) => console.error("Error al cargar los proyectos:", err));
  }, []);

  const seleccionar_proyecto = (id_categoria: string, id_proyecto: string) => {
    set_votos((prev) => ({
      ...prev,
      [id_categoria]: id_proyecto
    }));
  };

  const total_categorias = lista_categorias.length;
  const categorias_votadas = Object.keys(votos).length;
  const votacion_completa = categorias_votadas === total_categorias;

  const abrir_modal = () => set_modal_abierto(true);
  
  const cerrar_modal = () => {
    if (estado_validacion === 'exito') return; 
    set_modal_abierto(false);
    set_token_ingresado('');
    set_estado_validacion('ocioso');
  };

  const validar_token_y_votar = async () => {
    set_estado_validacion('cargando');

    try {
      const promesas_votos = Object.entries(votos).map(([categoria, project_id]) => {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vote/project`, { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token_ingresado, 
            project_id: project_id, 
            categoria: categoria 
          })
        });
      });

      const respuestas = await Promise.all(promesas_votos);
      const todo_exito = respuestas.every((res) => res.ok);

      if (todo_exito) {
        set_estado_validacion('exito');
        setTimeout(() => {
          enrutador.push('/menu');
        }, 2500);
      } else {
        set_estado_validacion('error');
      }
    } catch (error) {
      console.error("Error de red al enviar el voto:", error);
      set_estado_validacion('error');
    }
  };

  return (
    <div className={estilos.contenedor_principal}>
      <header className={estilos.cabecera_fija}>
        <div className={estilos.grupo_izquierdo}>
          <div className={estilos.contenedor_logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/4.png" alt="Logo Votación" className={estilos.imagen_logo} />
          </div>
          <Link href="/menu" className={estilos.boton_regresar}>
            <span className={estilos.texto_volver}>VOLVER</span>
          </Link>
        </div>

        <div className={`${estilos.contador_votos} ${votacion_completa ? estilos.contador_completo : ''}`}>
          {categorias_votadas} / {total_categorias}
        </div>
      </header>

      {lista_categorias.map((categoria) => (
        <section key={categoria.id_categoria} className={estilos.seccion_categoria}>
          <h2 className={estilos.titulo_categoria}>{categoria.nombre_categoria}</h2>
          <div className={estilos.cuadricula_proyectos}>
            {lista_proyectos.map((proyecto) => {
              const esta_seleccionado = votos[categoria.id_categoria] === proyecto.id;

              return (
                <article 
                  key={`${categoria.id_categoria}-${proyecto.id}`}
                  className={`${estilos.tarjeta_votacion} ${esta_seleccionado ? estilos.tarjeta_seleccionada : ''}`}
                  onClick={() => seleccionar_proyecto(categoria.id_categoria, proyecto.id)}
                >
                  <div className={`${estilos.contenido_tarjeta} ${esta_seleccionado ? estilos.contenido_gris : ''}`}>
                    {proyecto.url_imagen && proyecto.url_imagen.length > 0 ? ( 
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={proyecto.url_imagen[0]} alt={proyecto.nombre} className={estilos.imagen_pequena} />
                    ) : (
                      <div className={estilos.imagen_pequena} style={{ backgroundColor: '#eee' }}></div>
                    )}
                    
                    <div className={estilos.textos_tarjeta}>
                      <h3 className={estilos.nombre_proyecto}>{proyecto.nombre}</h3>
                      <span className={estilos.stand_proyecto}>Stand {proyecto.numero_stand}</span>
                    </div>
                  </div>
                  
                  {esta_seleccionado && (
                    <div className={estilos.indicador_exito}>
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={estilos.icono_palomita}
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 12l3 3 5-6"></path>
                      </svg>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div className={estilos.contenedor_boton_final}>
        <button 
          className={estilos.boton_enviar_votos}
          disabled={!votacion_completa}
          onClick={abrir_modal}
        >
          {votacion_completa ? 'VOTAR' : 'VOTA EN TODAS LAS CATEGORÍAS'}
        </button>
      </div>

      {modal_abierto && (
        <div className={estilos.fondo_modal}>
          <div className={estilos.caja_modal}>
            
            {estado_validacion !== 'exito' && (
              <button className={estilos.boton_cerrar_modal} onClick={cerrar_modal}>
                &times;
              </button>
            )}

            <h2 className={estilos.titulo_modal}>Autenticación</h2>
            
            {estado_validacion === 'ocioso' && (
              <>
                <p className={estilos.texto_modal}>Ingresa tu token físico para validar tus votos.</p>
                <input 
                  type="text" 
                  className={estilos.input_token} 
                  placeholder="Ej: aB3dE6"
                  value={token_ingresado}
                  onChange={(e) => set_token_ingresado(e.target.value)}
                  maxLength={6}
                />
                <button 
                  className={estilos.boton_validar} 
                  onClick={validar_token_y_votar}
                  disabled={token_ingresado.length !== 6} 
                >
                  VALIDAR TOKEN
                </button>
              </>
            )}

            {estado_validacion === 'cargando' && (
              <div className={estilos.boton_validar} style={{ pointerEvents: 'none' }}>
                <div className={estilos.rueda_carga}></div>
                VALIDANDO...
              </div>
            )}

            {estado_validacion === 'exito' && (
              <div className={estilos.mensaje_resultado}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${estilos.icono_resultado} ${estilos.exito}`}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12l3 3 5-6"></path>
                </svg>
                <h3 style={{ color: 'var(--color_exito)', margin: 0 }}>¡Votos Registrados!</h3>
                <p>Tu token ha sido validado correctamente. Redirigiendo al menú...</p>
              </div>
            )}

            {estado_validacion === 'error' && (
              <div className={estilos.mensaje_resultado}>
                <div className={`${estilos.icono_resultado} ${estilos.error}`}>&#10006;</div>
                <h3 style={{ color: 'var(--color_error)', margin: 0 }}>Token Inválido</h3>
                <p>Ese token no existe, es incorrecto o ya fue utilizado. Verifica tus datos.</p>
                <button className={estilos.boton_validar} onClick={() => set_estado_validacion('ocioso')}>
                  INTENTAR DE NUEVO
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}