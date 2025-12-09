import { Component } from '@angular/core';
import { ProductosService, Producto } from '../../services/productosServices/productos-services';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Marcas } from '../../services/marcas/marcas';
import { Categorias } from '../../services/categorias/categorias';

@Component({
  selector: 'app-pag-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pag-admin-productos.html',
})
export class PagAdminProductos {

  productos: Producto[] = [];
  categorias: any[] = [];
  marcas: any[] = [];
  nuevaCategoria: string = '';
  categoriaEditando: any = null;
  modalCategorias = false;
  modalMarcas = false;


  nuevaMarca: string = '';
  marcaEditando: any = null;


  imagenBase64: string | null = null;

  modalAbierto = false;
  productoEditando: Producto | null = null;


  formProducto!: FormGroup;

  validaciones = {
    nombre: [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s]+$/)],
    descripcion: [Validators.required],
    precio_venta: [Validators.required, Validators.min(0)],
    stock: [Validators.required, Validators.min(0)],
    id_categoria: [Validators.required],
    id_marca: [Validators.required],
    estado: [Validators.required]
  };

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private marcasServices: Marcas,
    private categoriasServices: Categorias
  ) {
    this.formProducto = this.fb.group({
      nombre: ['', this.validaciones.nombre],
      descripcion: ['', this.validaciones.descripcion],
      precio_venta: [0, this.validaciones.precio_venta],
      stock: [0, this.validaciones.stock],
      id_categoria: [null, this.validaciones.id_categoria],
      id_marca: [null, this.validaciones.id_marca],
      estado: ['activo', this.validaciones.estado],
      imagen: ['']
    });
  }

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarcas();
  }

  soloNumeros(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) event.preventDefault();
  }

  soloLetras(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]$/.test(char)) event.preventDefault();
  }

  soloLetrasNumeros(event: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
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

    this.formProducto.reset({
      nombre: '',
      descripcion: '',
      precio_venta: 0,
      stock: 0,
      id_categoria: 0,
      id_marca: 0,
      estado: 'activo'
    });


    this.modalAbierto = true;
  }

  abrirModalEditar(p: Producto) {
    this.productoEditando = p;
    
    this.formProducto.setValue({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio_venta: p.precio_venta,
      stock: p.stock ?? 0,
      id_categoria: p.categoria?.id_categoria!,
      id_marca: p.marca?.id_marca!,
      estado: p.estado,
      imagen: p.imagen || ''
    });

    this.imagenBase64 = p.imagen 
      ? p.imagen.replace(/^data:image\/\w+;base64,/, '')
      : null;

    this.modalAbierto = true;
  }



  cerrarModal() {
    this.modalAbierto = false;
  }

  // ✅ Crear o editar producto
guardarProducto() {

  if (this.imagenBase64) {
  this.formProducto.patchValue({ imagen: this.imagenBase64 });
  }

  // 🟢 Caso 1: CREAR PRODUCTO
 if (!this.productoEditando) {

  this.productosService.crearProducto(this.formProducto.value).subscribe({
    next: () => {
      this.cargarProductos();
      this.cerrarModal();
      Swal.fire({
        icon: 'success',
        title: 'Producto creado correctamente',
        timer: 1500,
        showConfirmButton: false
      });
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

  this.productosService.actualizarProducto(id, this.formProducto.value).subscribe({
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

crearCategoria() {
  if (!this.nuevaCategoria.trim()) return;

  this.categoriasServices.crearCategoria({ nombre: this.nuevaCategoria }).subscribe({
    next: () => {
      this.cargarCategorias();
      this.nuevaCategoria = '';

      Swal.fire({
        icon: 'success',
        title: 'Categoría creada',
        timer: 1400,
        showConfirmButton: false
      });
    }
  });
}

editarCategoria(cat: any) {
  this.categoriaEditando = { ...cat };
}

guardarEdicionCategoria() {
  this.categoriasServices.actualizarCategoria(
    this.categoriaEditando.id_categoria,
    { nombre: this.categoriaEditando.nombre }
  ).subscribe({
    
    next: () => {
      this.categoriaEditando = null;
      this.cargarCategorias();

      Swal.fire({
        icon: 'success',
        title: 'Categoría actualizada',
        timer: 1400,
        showConfirmButton: false
      });
    }
  });
}

eliminarCategoria(id: number) {

  Swal.fire({
    title: '¿Eliminar categoría?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {

    if (result.isConfirmed) {
      this.categoriasServices.eliminarCategoria(id).subscribe({

        next: () => {
          this.cargarCategorias();

          Swal.fire({
            icon: 'success',
            title: 'Categoría eliminada',
            timer: 1300,
            showConfirmButton: false
          });
        },

        error: (err) => {
          console.error("Error al eliminar categoría:", err);

          // Si el backend envía error 400 (relaciones)
          if (err.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar',
              text: err.error.error || 'La categoría está asociada a productos.'
            });
            return;
          }

          // Error general
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al eliminar la categoría.'
          });
        }

      });
    }

  });

}


crearMarca() {
  if (!this.nuevaMarca.trim()) return;

  this.marcasServices.crearMarca({ nombre: this.nuevaMarca }).subscribe({
    next: () => {
      this.cargarMarcas();
      this.nuevaMarca = '';

      Swal.fire({
        icon: 'success',
        title: 'Marca creada',
        timer: 1300,
        showConfirmButton: false
      });
    }
  });
}

editarMarca(marca: any) {
  this.marcaEditando = { ...marca };
}

guardarEdicionMarca() {
  this.marcasServices.actualizarMarca(
    this.marcaEditando.id_marca,
    { nombre: this.marcaEditando.nombre }
  ).subscribe({
    next: () => {
      this.marcaEditando = null;
      this.cargarMarcas();

      Swal.fire({
        icon: 'success',
        title: 'Marca actualizada',
        timer: 1300,
        showConfirmButton: false
      });
    }
  });
}

eliminarMarca(id: number) {
  Swal.fire({
    title: '¿Eliminar marca?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {

    if (result.isConfirmed) {
      this.marcasServices.eliminarMarca(id).subscribe({
        
        next: () => {
          this.cargarMarcas();
          Swal.fire('Eliminado', 'La marca fue eliminada', 'success');
        },

        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'No se puede eliminar',
            text: err.error?.error || "La marca está asociada a productos."
          });
        }

      });
    }

  });
}


abrirModalCategorias() {
  this.modalCategorias = true;
}

cerrarModalCategorias() {
  this.modalCategorias = false;
  this.categoriaEditando = null;
}

abrirModalMarcas() {
  this.modalMarcas = true;
}

cerrarModalMarcas() {
  this.modalMarcas = false;
  this.marcaEditando = null;
}


selectedCategoryName() {
  const idCat = this.formProducto.get('id_categoria')?.value;
  const cat = this.categorias.find(c => c.id_categoria === idCat);
  return cat?.nombre;
}


  // ✅ Convertir a Base64
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = (reader.result as string).split(',')[1];
    this.imagenBase64 = base64;
    this.formProducto.patchValue({ imagen: base64 });
  };
  reader.readAsDataURL(file);
}

}