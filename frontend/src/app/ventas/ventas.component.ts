import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagosService } from '../services/PagosServices.service';
import { Cliente } from '../interfaces/cliente';
import { Empresa } from '../interfaces/empresa';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  listVentas: Cliente[] = [];
  ventasFiltradas: Cliente[] = [];
  empresas: Empresa[] = [];
  filtroForm: FormGroup;
  busquedaTexto: string = '';
  
  // Estadísticas
  totalVentas: number = 0;
  totalImporte: number = 0;
  promedioVenta: number = 0;
  
  constructor(
    private router: Router, 
    private _pagosService: PagosService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      empresa: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
  }
  
  ngOnInit(): void {
    this.obtenerEmpresas();
    this.obtenerVentas();
  }

  obtenerEmpresas() {
    this._pagosService.getEmpresas().subscribe(data => {
      this.empresas = data;
    });
  }

  obtenerVentas() {
    this._pagosService.getVentas().subscribe(data => {
      this.listVentas = data;
      this.ventasFiltradas = data;
      this.calcularEstadisticas();
    });
  }

  calcularEstadisticas() {
    this.totalVentas = this.ventasFiltradas.length;
    this.totalImporte = this.ventasFiltradas.reduce((sum, venta) => sum + (venta.importe || 0), 0);
    this.promedioVenta = this.totalVentas > 0 ? this.totalImporte / this.totalVentas : 0;
  }

  aplicarFiltros() {
    const filtros = this.filtroForm.value;
    const idEmpresa = filtros.empresa ? parseInt(filtros.empresa) : undefined;
    
    this._pagosService.getVentasFiltradas(
      idEmpresa,
      filtros.fechaInicio || undefined,
      filtros.fechaFin || undefined
    ).subscribe(data => {
      this.listVentas = data;
      this.aplicarBusqueda();
    });
  }

  aplicarBusqueda() {
    if (!this.busquedaTexto.trim()) {
      this.ventasFiltradas = [...this.listVentas];
    } else {
      const texto = this.busquedaTexto.toLowerCase();
      this.ventasFiltradas = this.listVentas.filter(v => {
        const nombre = (v.nombreCliente || '').toLowerCase();
        const apellido = (v.apellidoCliente || '').toLowerCase();
        const empresa = this.obtenerNombreEmpresa(v.idEmpresa).toLowerCase();
        const importe = v.importe?.toString() || '';
        
        return nombre.includes(texto) || 
               apellido.includes(texto) || 
               empresa.includes(texto) ||
               importe.includes(texto);
      });
    }
    this.calcularEstadisticas();
  }

  limpiarFiltros() {
    this.filtroForm.reset();
    this.busquedaTexto = '';
    this.obtenerVentas();
  }

  descargarExcel() {
    const filtros = this.filtroForm.value;
    const idEmpresa = filtros.empresa ? parseInt(filtros.empresa) : undefined;
    
    this._pagosService.descargarExcel(
      idEmpresa,
      filtros.fechaInicio || undefined,
      filtros.fechaFin || undefined
    );
  }

  obtenerNombreEmpresa(idEmpresa: number): string {
    const empresa = this.empresas.find(e => e.idEmpresa === idEmpresa);
    return empresa ? empresa.nombre : 'N/A';
  }
  
  volver() {
    this.router.navigate(['']);
  }
}
