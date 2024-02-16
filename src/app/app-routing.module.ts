import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/auth.guard';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { PendudukComponent } from './penduduk/penduduk.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'register',
    redirectTo: '/register',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: HomeComponent,
      },
      {
        path: 'penduduk',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./penduduk/penduduk.module').then((m) => m.PendudukModule),
      },
      {
        path: 'penduduk-pindah',
        loadChildren: () =>
          import('./penduduk-pindah/penduduk-pindah.module').then(
            (m) => m.PendudukPindahModule
          ),
      },
      {
        path: 'penduduk-meninggal',
        loadChildren: () =>
          import('./penduduk-meninggal/penduduk-meninggal.module').then(
            (m) => m.PendudukMeninggalModule
          ),
      },
      {
        path: 'surat-pengantar',
        loadChildren: () =>
          import('./surat-pengantar/surat-pengantar.module').then(
            (m) => m.SuratPengantarModule
          ),
      },
      {
        path: 'kartu-keluarga',
        loadChildren: () =>
          import('./kartu-keluarga/kartu-keluarga.module').then(
            (m) => m.KartuKeluargaModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
