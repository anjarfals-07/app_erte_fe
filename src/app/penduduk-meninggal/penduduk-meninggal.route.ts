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
import {
  IPendudukMeninggal,
  PendudukMeninggal,
} from './penduduk-meninggal.model';
import { PendudukMeninggalService } from './penduduk-meninggal.service';
import { PendudukMeninggalComponent } from './penduduk-meninggal.component';

@Injectable({ providedIn: 'root' })
export class PendudukMeninggalResolve implements Resolve<IPendudukMeninggal> {
  constructor(
    private service: PendudukMeninggalService,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): IPendudukMeninggal | Observable<IPendudukMeninggal> {
    console.log('PendudukMeninggalResolve', route);

    const useTemplate = '';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cif: HttpResponse<IPendudukMeninggal>) => {
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
        map((res: HttpResponse<IPendudukMeninggal>) => res.body),
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
    const newItem = new PendudukMeninggal();
    return of(newItem);
  }
}

export const pendudukMeninggalRoute: Routes = [
  {
    path: '',
    component: PendudukMeninggalComponent,
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
