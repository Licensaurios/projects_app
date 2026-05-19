"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import estilos from './login.module.css';

export default function PantallaLogin() {
  const enrutador = useRouter();
  const [correo, set_correo] = useState('');
  const [password, set_password] = useState('');
  const [error, set_error] = useState('');
  const [cargando, set_cargando] = useState(false);

  const manejar_login = async (e: React.FormEvent) => {
    e.preventDefault();
    set_error('');
    set_cargando(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña: password }) 
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin_token', data.token);
        enrutador.push('/admin');
      } else {
        set_error('Credenciales inválidas. Intenta de nuevo.');
      }
    } catch {
      set_error('Error de conexión con el servidor.');
    } finally {
      set_cargando(false);
    }
  };

  return (
    <div className={estilos.pantalla_login}>
      <div className={estilos.tarjeta_login}>
        <h1 className={estilos.titulo}>Panel Admin</h1>
        <form className={estilos.formulario} onSubmit={manejar_login}>
          <div className={estilos.grupo_input}>
            <label className={estilos.label}>Correo Electrónico</label>
            <input 
              type="email" 
              className={estilos.input} 
              value={correo} 
              onChange={(e) => set_correo(e.target.value)} 
              required 
            />
          </div>
          <div className={estilos.grupo_input}>
            <label className={estilos.label}>Contraseña</label>
            <input 
              type="password" 
              className={estilos.input} 
              value={password} 
              onChange={(e) => set_password(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={estilos.boton_entrar} disabled={cargando}>
            {cargando ? 'VERIFICANDO...' : 'ENTRAR AL RANKING'}
          </button>
        </form>
        {error && <p className={estilos.error}>{error}</p>}
      </div>
    </div>
  );
}