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
import { SuratPengantarService } from './surat-pengantar.service';
import { SuratPengantarComponent } from './surat-pengantar.component';
import { ISuratPengantar, SuratPengantar } from './surat-pengantar.model';

@Injectable({ providedIn: 'root' })
export class SuratPengantarhResolve implements Resolve<ISuratPengantar> {
  constructor(private service: SuratPengantarService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): ISuratPengantar | Observable<ISuratPengantar> {
    const useTemplate = '';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cif: HttpResponse<SuratPengantar>) => {
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
        map((res: HttpResponse<ISuratPengantar>) => res.body),
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
    const newItem = new SuratPengantar();
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

export const suratPengantarRoute: Routes = [
  {
    path: '',
    component: SuratPengantarComponent,
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
