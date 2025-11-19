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

  imagenBase64: string | null = null;

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
    stock: 0
  };


  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarcas();
  }

  // ✅ Cargar datos
  cargarProductos() {
    this.productosService.obtenerProductos().subscribe(data => {
      this.productos = data;

      this.productos.forEach(p => {
        this.productosService.obtenerStock(p.id_producto!).subscribe(stockResp => {
          p.stock = stockResp.cantidad;
        });
      });
    });
  }


  cargarCategorias() {
    this.productosService.obtenerCategorias().subscribe(data => this.categorias = data);
  }

  cargarMarcas() {
    this.productosService.obtenerMarcas().subscribe(data => this.marcas = data);
  }

  // ✅ Modal
  abrirModalCrear() {
    this.productoEditando = null;
    this.imagenBase64 = null;

    this.form = {
      id_producto: undefined,
      nombre: '',
      descripcion: '',
      precio_venta: 0,
      imagen: '',
      id_categoria: 0,
      id_marca: 0,
      estado: 'activo'
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
      stock: p.stock ?? 0
    };

    this.imagenBase64 = p.imagen || null;

    this.modalAbierto = true;
  }


  cerrarModal() {
    this.modalAbierto = false;
  }

  // ✅ Crear o editar producto
guardarProducto() {

  if (this.imagenBase64) {
    this.form.imagen = this.imagenBase64;
  }

  // 🟢 Caso 1: CREAR
  if (!this.productoEditando) {

    this.productosService.crearProducto(this.form).subscribe((nuevo: any) => {

      const id = nuevo.id_producto;

      // Si hay imagen, subirla
      if (this.imagenBase64) {
        this.productosService
          .subirImagenBase64(id, this.imagenBase64)
          .subscribe(() => {
            this.cargarProductos();
            this.cerrarModal();
          });

      } else {
        // Si no hay imagen, solo recargar y cerrar
        this.cargarProductos();
        this.cerrarModal();
      }

    });

  } 
  // 🔵 Caso 2: EDITAR
  else {

    const id = this.productoEditando.id_producto!;

    this.productosService.actualizarProducto(id, this.form).subscribe(() => {

      // Si se cambió la imagen, subirla
      if (this.imagenBase64) {
        this.productosService
          .subirImagenBase64(id, this.imagenBase64)
          .subscribe(() => {
            this.cargarProductos();
            this.cerrarModal();
          });

      } else {
        // Si no se cambió imagen, solo recargar y cerrar
        this.cargarProductos();
        this.cerrarModal();
      }

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

  // ✅ Convertir a Base64
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenBase64 = (reader.result as string).split(',')[1];
    };
    reader.readAsDataURL(file);
  }
}
