import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  excelFilename: string | null = null;
  downloadUrl: string | null = null;
  fullDownloadUrl: string = '';

  constructor(private router: Router){
    
  }

  ngOnInit(): void {
    // Obtener información del Excel del estado de navegación
    const state = history.state;
    if (state && state.excelFilename) {
      this.excelFilename = state.excelFilename;
      this.downloadUrl = state.downloadUrl;
      if (this.downloadUrl) {
        this.fullDownloadUrl = environment.endpoint + this.downloadUrl.replace(/^\//, '');
      }
    }
  }

  descargarExcel() {
    if (this.fullDownloadUrl) {
      window.open(this.fullDownloadUrl, '_blank');
    }
  }

  verPagos() {
    this.router.navigate(['/ventas']);
  }

  volver(){
    this.router.navigate([''])
  }

}
