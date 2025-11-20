import { Component } from '@angular/core';
import { ProductosService, Producto } from '../../services/productosServices/productos-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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

  // 🟢 Caso 1: CREAR PRODUCTO
  if (!this.productoEditando) {

    this.productosService.crearProducto(this.form).subscribe({
      next: (nuevo: any) => {

        const id = nuevo.id_producto;

        const finalizar = () => {
          this.cargarProductos();
          this.cerrarModal();

          Swal.fire({
            icon: 'success',
            title: 'Producto creado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        };

        if (this.imagenBase64) {
          this.productosService
            .subirImagenBase64(id, this.imagenBase64)
            .subscribe(finalizar);
        } else {
          finalizar();
        }
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el producto',
          text: 'Revisa los datos e intenta nuevamente.'
        });
      }
    });

    return;
  }

  // 🔵 Caso 2: EDITAR PRODUCTO
  const id = this.productoEditando.id_producto!;

  this.productosService.actualizarProducto(id, this.form).subscribe({
    next: () => {

      const finalizar = () => {
        this.cargarProductos();
        this.cerrarModal();

        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
      };

      if (this.imagenBase64) {
        this.productosService
          .subirImagenBase64(id, this.imagenBase64)
          .subscribe(finalizar);
      } else {
        finalizar();
      }
    },

    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el producto',
        text: 'Intenta nuevamente.'
      });
    }
  });
}



eliminar(id: number) {

  Swal.fire({
    title: '¿Eliminar producto?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.isConfirmed) {

      this.productosService.eliminarProducto(id).subscribe({
        
        next: () => {
          // quitarlo de la lista
          this.productos = this.productos.filter(p => p.id_producto !== id);

          Swal.fire({
            icon: 'success',
            title: 'Producto eliminado',
            timer: 1500,
            showConfirmButton: false
          });
        },

        error: (err) => {

          if (err.status === 409) {
            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar',
              text: err.error.mensaje || 'Este producto está relacionado con ventas u otros registros.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error en el servidor',
              text: 'No se pudo eliminar el producto.'
            });
          }

        }

      });
    }

  });

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
