import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  ext: {
    loadimpact: {
      name: 'Diagnostico Registro Usuarios',
      // Borramos el projectID para que k6 lo genere solo
    }
  },
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],
  },
};

// Función auxiliar para crear datos únicos en cada iteración
function generarDatosUsuario() {
  const idAleatorio = Math.floor(Math.random() * 100000);
  return {
    nombre: `Usuario ${idAleatorio}`,
    email: `test_${idAleatorio}@gmail.com`,
    clave: 'Password123', // Cumple con tu validación: 8 caracteres, mayúscula y número
    id_rol: 2 // Asumiendo un ID de rol existente (ej: Cliente/Aprendiz)
  };
}

// OK, comentario para CRUD del software.

export default function () {
  const url = 'http://localhost:3000/api/usuarios';
  const payload = JSON.stringify(generarDatosUsuario());

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  // Verificaciones basadas en tu lógica de controlador
  check(res, {
    'registro exitoso (200)': (r) => r.status === 200,
    'contiene id_usuario': (r) => r.json().hasOwnProperty('id_usuario'),
    'contiene nombre de rol': (r) => r.json().rol !== null,
  });

  sleep(1); // El usuario tarda un poco entre registros
}