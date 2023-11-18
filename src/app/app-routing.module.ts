import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  // {
  //   path: 'penduduk',
  //   component: PendudukComponent,
  // },

  {
    path: 'penduduk',
    loadChildren: () =>
      import('./penduduk/penduduk.module').then((m) => m.PendudukModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
