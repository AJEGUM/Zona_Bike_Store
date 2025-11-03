import { Component } from '@angular/core';
import { ProductosService, Producto } from '../../services/productosServices/productos-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pag-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pag-admin-productos.html',
})
export class PagAdminProductos {

  productos: Producto[] = [];
  categorias: any[] = [];
  marcas: any[] = [];

  modalAbierto = false;
  productoEditando: Producto | null = null;

  form: Producto = {
    id_producto: undefined,
    nombre: '',
    descripcion: '',
    precio_venta: 0,
    imagen: '',
    id_categoria: 0,
    id_marca: 0,
    estado: 'activo',
    categoria: undefined,
    marca: undefined
  };

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarcas();
  }

  // ----------- Cargar datos -----------

  cargarProductos() {
    this.productosService.obtenerProductos().subscribe(data => this.productos = data);
  }

  cargarCategorias() {
    this.productosService.obtenerCategorias().subscribe(data => this.categorias = data);
  }

  cargarMarcas() {
    this.productosService.obtenerMarcas().subscribe(data => this.marcas = data);
  }

  // ----------- Modal -----------

  abrirModalCrear() {
    this.productoEditando = null;

    this.form = {
      id_producto: undefined,
      nombre: '',
      descripcion: '',
      precio_venta: 0,
      imagen: '',
      id_categoria: 0,
      id_marca: 0,
      estado: 'activo',
      categoria: undefined,
      marca: undefined
    };

    this.modalAbierto = true;
  }

  abrirModalEditar(p: Producto) {
    this.productoEditando = p;

    this.form = {
      id_producto: p.id_producto,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio_venta: p.precio_venta,
      imagen: p.imagen,
      estado: p.estado,
      id_categoria: p.categoria?.id_categoria!,
      id_marca: p.marca?.id_marca!,
      categoria: p.categoria,
      marca: p.marca
    };

    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  // ----------- Guardar / Actualizar -----------

  guardarProducto() {

    const payload = {
      nombre: this.form.nombre,
      descripcion: this.form.descripcion,
      precio_venta: this.form.precio_venta,
      imagen: this.form.imagen,
      id_categoria: this.form.id_categoria,
      id_marca: this.form.id_marca,
      estado: this.form.estado
    };

    if (this.productoEditando) {

      this.productosService.actualizarProducto(this.productoEditando.id_producto!, payload)
        .subscribe(() => {
          this.cargarProductos();
          this.cerrarModal();
        });

    } else {

      this.productosService.crearProducto(payload)
        .subscribe(() => {
          this.cargarProductos();
          this.cerrarModal();
        });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      this.productosService.eliminarProducto(id).subscribe(() => {
        this.productos = this.productos.filter(p => p.id_producto !== id);
      });
    }
  }

  selectedCategoryName() {
    const cat = this.categorias.find(c => c.id_categoria === this.form.id_categoria);
    return cat?.nombre;
  }

}
