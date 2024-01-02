import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'material.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome/font-awesome-icon';
import { DatePipe } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { PendudukComponent } from './penduduk/penduduk.component';
import { PendudukCreateComponent } from './penduduk/penduduk-create/penduduk-create.component';
import { PendudukUpdateComponent } from './penduduk/penduduk-update/penduduk-update.component';
import { PendudukPindahComponent } from './penduduk-pindah/penduduk-pindah.component';
import { PendudukMeninggalComponent } from './penduduk-meninggal/penduduk-meninggal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    HomeComponent,
    ConfirmDialogComponent,
    PendudukComponent,
    PendudukPindahComponent,
    PendudukMeninggalComponent,

    // PendudukCreateComponent,
    // PendudukUpdateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, // Tambahkan HttpClientModule di sini
    MaterialModule,

    // MatPaginatorModule,
  ],
  providers: [ConfirmationService, MessageService, DatePipe],

  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(...fontAwesomeIcons);
  }
}
