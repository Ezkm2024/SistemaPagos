import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Cliente } from '../interfaces/cliente';
import { Observable } from 'rxjs';
import { Empresa } from '../interfaces/empresa';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private myAppUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;  
  }

  getVentas(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.myAppUrl + 'ventas');
  }

  getVentasFiltradas(idEmpresa?: number, fechaInicio?: string, fechaFin?: string): Observable<Cliente[]> {
    let url = this.myAppUrl + 'ventas/filtradas?';
    if (idEmpresa) url += `idEmpresa=${idEmpresa}&`;
    if (fechaInicio) url += `fechaInicio=${fechaInicio}&`;
    if (fechaFin) url += `fechaFin=${fechaFin}&`;
    return this.http.get<Cliente[]>(url);
  }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.myAppUrl + 'empresas');
  }

  getEmpresasAPagar(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.myAppUrl);
  }

  addPago(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.myAppUrl + 'api/pagos', cliente, httpOptions);
  }

  crearEmpresa(empresa: { nombre: string }): Observable<any> {
    return this.http.post<any>(this.myAppUrl + 'empresas', empresa, httpOptions);
  }

  actualizarEmpresa(id: number, empresa: { nombre: string }): Observable<any> {
    return this.http.put<any>(this.myAppUrl + `empresas/${id}`, empresa, httpOptions);
  }

  eliminarEmpresa(id: number): Observable<any> {
    return this.http.delete<any>(this.myAppUrl + `empresas/${id}`, httpOptions);
  }

  descargarExcel(idEmpresa?: number, fechaInicio?: string, fechaFin?: string): void {
    let url = this.myAppUrl + 'ventas/excel?';
    if (idEmpresa) url += `idEmpresa=${idEmpresa}&`;
    if (fechaInicio) url += `fechaInicio=${fechaInicio}&`;
    if (fechaFin) url += `fechaFin=${fechaFin}&`;
    
    window.open(url, '_blank');
  }
}
