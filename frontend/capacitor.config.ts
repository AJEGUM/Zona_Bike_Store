import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zonabikestore.app',
  appName: 'Zona Bike Store',
  webDir: 'dist/frontend/browser',
  server: {
    // Añade esta línea con tu IP y el puerto de Angular
    // url: 'http://192.168.18.89:4200',
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;