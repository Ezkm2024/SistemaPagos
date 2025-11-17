import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { PagoComponent } from './pago/pago.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas/ventas.component';
import { AddEditEmpresasComponent } from './add-edit-empresas/add-edit-empresas.component';

const routes: Routes = [
  {
    path: '',
    component: FormComponent
  },
  {
    path: 'pagos',
    component: PagoComponent
  },
  {
    path: 'ventas',
    component: VentasComponent
  },
  {
    path: 'empresas',
    component: AddEditEmpresasComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    PagoComponent,
    HeaderComponent,
    FooterComponent,
    VentasComponent,
    AddEditEmpresasComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
