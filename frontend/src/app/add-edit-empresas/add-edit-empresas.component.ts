import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagosService } from '../services/PagosServices.service';
import { Empresa } from '../interfaces/empresa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-empresas',
  templateUrl: './add-edit-empresas.component.html',
  styleUrls: ['./add-edit-empresas.component.css']
})
export class AddEditEmpresasComponent implements OnInit {

  empresas: Empresa[] = [];
  empresaForm: FormGroup;
  empresaEditando: Empresa | null = null;
  mostrarFormulario: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private _pagosService: PagosService,
    private router: Router
  ) {
    this.empresaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.obtenerEmpresas();
  }

  obtenerEmpresas(): void {
    this._pagosService.getEmpresas().subscribe(data => {
      this.empresas = data;
    });
  }

  mostrarFormCrear(): void {
    this.empresaEditando = null;
    this.empresaForm.reset();
    this.mostrarFormulario = true;
  }

  mostrarFormEditar(empresa: Empresa): void {
    this.empresaEditando = empresa;
    this.empresaForm.patchValue({
      nombre: empresa.nombre
    });
    this.mostrarFormulario = true;
  }

  cancelarEdicion(): void {
    this.mostrarFormulario = false;
    this.empresaEditando = null;
    this.empresaForm.reset();
  }

  guardarEmpresa(): void {
    if (this.empresaForm.invalid) {
      return;
    }

    const nombre = this.empresaForm.value.nombre;

    if (this.empresaEditando) {
      // Editar empresa existente
      this._pagosService.actualizarEmpresa(this.empresaEditando.idEmpresa, { nombre })
        .subscribe(() => {
          this.obtenerEmpresas();
          this.cancelarEdicion();
        });
    } else {
      // Crear nueva empresa
      this._pagosService.crearEmpresa({ nombre })
        .subscribe(() => {
          this.obtenerEmpresas();
          this.cancelarEdicion();
        });
    }
  }

  eliminarEmpresa(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta empresa?')) {
      this._pagosService.eliminarEmpresa(id).subscribe(() => {
        this.obtenerEmpresas();
      });
    }
  }

  volver(): void {
    this.router.navigate(['']);
  }
}
