import http from 'k6/http';
import { check, sleep, group } from 'k6';

// 1. CONFIGURACIÓN GLOBAL
const BASE_URL = __ENV.BASE_URL || 'https://ajegumdev.com/api'; // URL de producción por defecto
const PASS_VIP = 'tu-clave-secreta'; // La que pusiste en Cloudflare

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.05'], // Que no falle más del 5% de peticiones
  },
};

// 2. GENERADORES DE DATOS (Mantenlos aquí o en un archivo aparte)
function datosRegistro() {
  const id = Math.floor(Math.random() * 100000);
  return JSON.stringify({
    nombre: `User_${id}`,
    email: `test_${id}@gmail.com`,
    clave: 'Password123',
    id_rol: 2
  });
}

// 3. CABECERAS ESTÁNDAR (Incluye el Pase VIP)
const params = {
  headers: {
    'Content-Type': 'application/json',
    'X-K6-Test': PASS_VIP,
  },
};

// 4. FLUJO DE PRUEBAS
export default function () {
  
  // RUTA 1: Registro de Usuarios
  group('Registro de Usuarios', function () {
    const res = http.post(`${BASE_URL}/usuarios`, datosRegistro(), params);
    check(res, {
      'registro status 200': (r) => r.status === 200,
      'tiene id_usuario': (r) => r.body && r.json().hasOwnProperty('id_usuario'),
    });
  });

  sleep(1);

  // RUTA 2: Login (Fácil de añadir/quitar)
  /*
  group('Login de Usuarios', function () {
    const payload = JSON.stringify({ email: 'test_123@gmail.com', clave: 'Password123' });
    const res = http.post(`${BASE_URL}/auth/login`, payload, params);
    check(res, {
      'login status 200': (r) => r.status === 200,
      'tiene token': (r) => r.json().hasOwnProperty('token'),
    });
  });
  */

  // RUTA 3: Obtener Productos (Lectura)
  group('Listar Productos', function () {
    const res = http.get(`${BASE_URL}/productos`, params);
    check(res, {
      'status 200': (r) => r.status === 200,
    });
  });

  sleep(1);
}