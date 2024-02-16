import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'material.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome/font-awesome-icon';
import { DatePipe } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { KartuKeluargaComponent } from './kartu-keluarga/kartu-keluarga.component';
import { LoginComponent } from './login/login.component';
import { PendudukMeninggalComponent } from './penduduk-meninggal/penduduk-meninggal.component';
import { PendudukPindahComponent } from './penduduk-pindah/penduduk-pindah.component';
import { PendudukCreateComponent } from './penduduk/penduduk-create/penduduk-create.component';
import { PendudukUpdateComponent } from './penduduk/penduduk-update/penduduk-update.component';
import { PendudukComponent } from './penduduk/penduduk.component';
import { SuratPengantarComponent } from './surat-pengantar/surat-pengantar.component';
import { AccountComponent } from './account/account.component';
import { AuthInterceptor } from './login/auth.interceptor';
import { LogoutDialogComponent } from './confirm-dialog/logout-dialog.component';
import { RegisterComponent } from './register/register.component';

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
    SuratPengantarComponent,
    KartuKeluargaComponent,
    LoginComponent,
    AccountComponent,
    LogoutDialogComponent,
    RegisterComponent,

    // PendudukCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
  ],
  // providers: [ConfirmationService, MessageService, DatePipe],
  providers: [
    ConfirmationService,
    MessageService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(...fontAwesomeIcons);
  }
}
