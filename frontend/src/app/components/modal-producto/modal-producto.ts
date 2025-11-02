import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productosServices/productos-services';

export interface Producto {
  id_producto?: number; // opcional para edición
  nombre: string;
  descripcion: string;
  precio_venta: number;
  imagen: string;
  id_categoria: number;
  id_marca: number;
  estado?: string;
}

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-producto.html',
  styles: ``,
})
export class ModalProducto implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() productoCreado = new EventEmitter<Producto>();
  @Input() productoEditar: Producto | null = null;

  form!: FormGroup;
  categorias: any[] = [];
  marcas: any[] = [];
  cargando = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private productosService: ProductosService) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [this.productoEditar?.nombre || '', Validators.required],
      descripcion: [this.productoEditar?.descripcion || '', Validators.required],
      imagen: [this.productoEditar?.imagen || '', Validators.required],
      id_categoria: [this.productoEditar?.id_categoria || '', Validators.required],
      id_marca: [this.productoEditar?.id_marca || '', Validators.required],
      precio_venta: [this.productoEditar?.precio_venta || 0, Validators.required],
      estado: [this.productoEditar?.estado || 'activo'],
    });

    this.cargarCategorias();
    this.cargarMarcas();
  }

  cargarCategorias() {
    this.productosService.obtenerCategorias().subscribe({
      next: (res) => (this.categorias = res),
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  cargarMarcas() {
    this.productosService.obtenerMarcas().subscribe({
      next: (res) => (this.marcas = res),
      error: (err) => console.error('Error al cargar marcas', err),
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const producto: Producto = {
      ...this.form.value,
      id_categoria: Number(this.form.value.id_categoria),
      id_marca: Number(this.form.value.id_marca),
      precio_venta: Number(this.form.value.precio_venta),
    };

    const request$ = this.productoEditar
      ? this.productosService.actualizarProducto(this.productoEditar.id_producto!, producto)
      : this.productosService.crearProducto(producto);

    request$.subscribe({
      next: (res) => {
        this.cargando = false;
        this.productoCreado.emit(res);
        this.cerrar.emit();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err?.error?.error || 'Error al guardar producto';
      },
    });
  }
}
