import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'penduduk',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
