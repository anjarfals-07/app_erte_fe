import { Injectable, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  Routes,
} from '@angular/router';
import { EMPTY, Observable, map, mergeMap, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { JhiResolvePagingParams } from '../shared/base/resolve-paging-params.service';
import { IKartuKeluarga, KartuKeluarga } from './kartukeluarga.model';
import { KartuKeluargaService } from './kartu-keluarga.service';
import { KartuKeluargaComponent } from './kartu-keluarga.component';

@Injectable({ providedIn: 'root' })
export class KartuKeluargaResolve implements Resolve<IKartuKeluarga> {
  constructor(private service: KartuKeluargaService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): IKartuKeluarga | Observable<IKartuKeluarga> {
    const useTemplate = '';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cif: HttpResponse<KartuKeluarga>) => {
          if (cif.body) {
            return of(cif.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IKartuKeluarga>) => res.body),
        mergeMap((res) => {
          if (res) {
            return of(res);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    const newItem = new KartuKeluarga();
    return of(newItem);
  }
}
// resolve(
//   route: ActivatedRouteSnapshot
// ): Observable<IPenduduk> | Observable<never> {
//   const useTemplate = 'default';
//   const id = route.params['id'];
//   if (id) {
//     return this.service.find(id).pipe(
//       mergeMap((penduduk: HttpResponse<Penduduk>) => {
//         if (penduduk.body) {
//           return of(penduduk.body);
//         } else {
//           this.router.navigate(['404']);
//           return EMPTY;
//         }
//       })
//     );
//   }
//   if (useTemplate) {
//     return this.service.template(useTemplate).pipe(
//       map((res: HttpResponse<IPenduduk>) => res.body),
//       mergeMap((res) => {
//         if (res) {
//           return of(res);
//         } else {
//           this.router.navigate(['404']);
//           return EMPTY;
//         }
//       })
//     );
//   }
//   const newItem = new Penduduk();
//   return of(newItem);
// }
// }

export const kartuKeluargaRoute: Routes = [
  {
    path: '',
    component: KartuKeluargaComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    // data: {
    //   authorities: ['ROLE_USER'],
    //   defaultSort: 'id,asc',
    //   pageTitle: 'losgwApp.surveyBatch.home.title',
    // },
    // canActivate: [UserRouteAccessService],
  },
  // {
  //   path: 'creatependuduk',
  //   component: PendudukCreateComponent,
  //   resolve: {
  //     content: PendudukResolve,
  //   },
  // },
  // {
  //   path: 'detail-pindah/:id',
  //   component: DetailPendudukPindahComponent,
  // },
];
