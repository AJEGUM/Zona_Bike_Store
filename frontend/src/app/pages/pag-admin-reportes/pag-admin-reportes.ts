import { Component } from '@angular/core';
import { Estadisticas } from '../../services/estadisticas/estadisticas';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pag-admin-reportes',
  standalone: true,
  imports: [ CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './pag-admin-reportes.html',
  styles: ``,
})
export class PagAdminReportes {

  productosLabels: string[] = [];
  productosData: number[] = [];
  listaProductos: any[] = [];
  sinRegistrosProductos = false;

  ventasLabels: string[] = [];
  ventasData: number[] = [];

  inicio = '';
  fin = '';

  constructor(private statsService: Estadisticas) {}

  ngOnInit() {
    this.cargarProductosMasVendidos();
  }

  cargarProductosMasVendidos() {
    this.statsService.obtenerProductosMasVendidos().subscribe(data => {

      if (!data || data.length === 0) {
        this.sinRegistrosProductos = true;

        this.productosLabels = ["Sin datos"];
        this.productosData = [0];
        this.listaProductos = [];     // <-- Vaciamos lista
        return;
      }

      this.sinRegistrosProductos = false;

      this.productosLabels = data.map((p: any) => p.nombre);
      this.productosData = data.map((p: any) => p.total_vendidos);

      // 🔥 Aquí llenamos la lista
      this.listaProductos = data.map((p: any) => ({
        nombre: p.nombre,
        total_vendido: p.total_vendidos
      }));

      this.chartDonutOptions.series = this.productosData;
      this.chartDonutOptions.labels = this.productosLabels;
    });
  }


cargarVentasPeriodo() {
  this.statsService.obtenerVentasPorPeriodo(this.inicio, this.fin)
    .subscribe(data => {

      // Extraer datos
      this.ventasLabels = data.map((x: any) => x.fecha);
      this.ventasData = data.map((x: any) => Number(x.total_ventas));

      // 🔥 Crear NUEVA referencia del objeto (Apex necesita esto para redibujar)
      this.chartBarOptions = {
        ...this.chartBarOptions,
        series: [
          {
            name: 'Ventas',
            data: this.ventasData
          }
        ],
        xaxis: {
          ...this.chartBarOptions.xaxis,
          categories: this.ventasLabels
        }
      };

    });
}



  totalProductos() {
    return this.productosData.reduce((a: number, b: number) => a + b, 0);
  }


  // Configuracion de donut y linea
 chartDonutOptions: any = {
  series: [],
  chart: {
    type: 'donut',
    height: 380,
    toolbar: {
      show: true,
      tools: {
        download: true
      }
    }
  },

  labels: [],

  dataLabels: {
    enabled: true,
    style: { colors: ['#fff'] }
  },

  legend: {
    labels: { colors: '#fff' }
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: { color: '#fff' },
          value: { color: '#fff' },
          total: {
            show: true,
            label: 'Total vendidos',
            color: '#fff',
            fontSize: '16px',
            formatter: () => {
              return this.totalProductos();
            }
          }
        }
      }
    }
  },

  // ⬇️⬇️ ESTA ES LA IMPLEMENTACIÓN QUE NECESITABAS
  responsive: [
    {
      breakpoint: 768, // celulares y tablets pequeñas
      options: {
        legend: {
          show: false // ❌ oculta las letras a la derecha
        }
      }
    }
  ]
};


  // Config de barras

chartBarOptions: any = {
  series: [
    {
      name: 'Ventas',
      data: []
    }
  ],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: true,
      tools: { download: true }
    },
    redrawOnParentResize: false,
    redrawOnWindowResize: false
  },

  // ⬅️ Aquí van los colores dinámicos reales
  colors: [
    ({ value }: any) => {
      if (value >= 20) return '#22c55e';
      if (value >= 10) return '#3b82f6';
      if (value >= 5)  return '#eab308';
      return '#ef4444';
    }
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      borderRadius: 6,
    }
  },

  xaxis: {
    categories: [],
    labels: { style: { colors: '#fff' } }
  },
  yaxis: {
    labels: { style: { colors: '#fff' } }
  },
  dataLabels: { enabled: false },
  legend: {
    labels: { colors: '#fff' }
  }
};


}
