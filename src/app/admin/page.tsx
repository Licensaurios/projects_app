"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import estilos from './admin.module.css';
interface RankingProyecto {
  titulo: string;
  equipo_responsable: string;
  total_votos: number;
}

export default function PantallaAdminRanking() {
  const enrutador = useRouter();
  
  const [rankings, set_rankings] = useState<{
    software: RankingProyecto[];
    hardware: RankingProyecto[];
    innovacion: RankingProyecto[];
  }>({
    software: [],
    hardware: [],
    innovacion: []
  });

  const obtener_datos = async (token: string) => {
    const categorias = ['software', 'hardware', 'innovacion'];
    const nuevos_rankings: Record<string, RankingProyecto[]> = {};

    for (const categoria of categorias) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/getranking/?categoria=${categoria}`, {
          method: 'GET', // 
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          }
        });

        if (res.ok) {
          const data: RankingProyecto[] = await res.json();
          nuevos_rankings[categoria] = data.slice(0, 3);
        }
      } catch (err) {
        console.error(`Error obteniendo ranking de ${categoria}:`, err);
      }
    }
    
    if (Object.keys(nuevos_rankings).length > 0) {
      set_rankings((prev) => ({ ...prev, ...nuevos_rankings }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      enrutador.push('/login');
      return;
    }

    obtener_datos(token);

    const intervalo = setInterval(() => {
      obtener_datos(token);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [enrutador]);

  const renderizar_columna = (titulo: string, proyectos: RankingProyecto[]) => (
    <div className={estilos.columna_categoria}>
      <h2 className={estilos.titulo_columna}>{titulo}</h2>
      <div className={estilos.lista_ranking}>
        {proyectos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Esperando votos...</p>
        ) : (
          proyectos.map((proyecto, index) => (
            <div 
              key={index} 
              className={`${estilos.tarjeta_puesto} ${index === 0 ? estilos.puesto_1 : index === 1 ? estilos.puesto_2 : estilos.puesto_3}`}
            >
              <div className={estilos.numero_puesto}>{index + 1}</div>
              <div className={estilos.info_proyecto}>
                <h3 className={estilos.nombre}>{proyecto.titulo}</h3>
                <p className={estilos.equipo}>{proyecto.equipo_responsable}</p>
              </div>
              <div className={estilos.votos}>
                {proyecto.total_votos} pts
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className={estilos.pantalla_admin}>
      <header className={estilos.cabecera}>
        <h1 className={estilos.titulo}>RANKING EXPO SISTEMAS DIGITALES</h1>

          <Link href="/menu" className={estilos.boton_regresar}>
            <span className={estilos.texto_volver}>VOLVER</span>
          </Link>
      </header>

      <div className={estilos.cuadricula_categorias}>
        {renderizar_columna('Software', rankings.software)}
        {renderizar_columna('Hardware', rankings.hardware)}
        {renderizar_columna('Innovación', rankings.innovacion)}
      </div>
    </div>
  );
}