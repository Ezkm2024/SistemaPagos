import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../interfaces/cliente';
import { PagosService } from '../services/PagosServices.service';
import { Empresa } from '../interfaces/empresa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  nombre: FormControl = new FormControl('', Validators.required);
  apellido: FormControl = new FormControl('', Validators.required);
  empresa: FormControl = new FormControl('', Validators.required);
  importe: FormControl = new FormControl(null, Validators.required);
  pago: FormControl = new FormControl('', Validators.required);
  fechaHoy: string = '';

  
  empresas: Empresa[] = [];

  public form: FormGroup;

  constructor(private fb: FormBuilder, private _pagosService: PagosService, private router: Router){
    const fecha = new Date();
    this.fechaHoy = this.formatoYYYYMMDD(fecha);

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      empresa: ['', Validators.required],
      importe: [null, [Validators.required, Validators.minLength(1)]],
      pago: ['', Validators.required]
    })
  }
  
  ngOnInit(): void{
    this.obtenerEmpresas()
  }

  ///Formateo de fechas en formato Año-Mes-Dia para que no me tome error en mysql
  formatoYYYYMMDD(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }


  obtenerEmpresas() {
    this._pagosService.getEmpresasAPagar().subscribe(data => {
      this.empresas = data
    })
  }

  send() {

    if(this.form.invalid) {
      return;
    }

    const cliente: Cliente = {
      idEmpresa: parseInt(this.form.value.empresa),
      nombreCliente: this.form.value.nombre,
      apellidoCliente: this.form.value.apellido,
      importe: this.form.value.importe,
      metodoDePago: this.form.value.pago,
      fechaDePago: this.fechaHoy,
    }

    this._pagosService.addPago(cliente).subscribe((response: any) => {
      console.log('Pago registrado exitosamente');
      // Guardar información del Excel en el estado de navegación
      if (response.excel) {
        this.router.navigate(['pagos'], { 
          state: { 
            excelFilename: response.excel.filename,
            downloadUrl: response.excel.downloadUrl 
          } 
        });
      } else {
        this.router.navigate(['pagos']);
      }
    }, error => {
      console.error('Error al registrar pago:', error);
      this.router.navigate(['pagos']);
    });

  }

}
