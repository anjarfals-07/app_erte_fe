import { Injectable, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { PendudukComponent } from './penduduk.component';
import { PendudukCreateComponent } from './penduduk-create/penduduk-create.component';
import { PendudukService } from './penduduk.service';
import { IPenduduk, Penduduk } from './penduduk.model';
import { EMPTY, Observable, map, mergeMap, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { JhiResolvePagingParams } from '../shared/base/resolve-paging-params.service';
import { PendudukUpdateComponent } from './penduduk-update/penduduk-update.component';
import { AuthGuard } from '../login/auth.guard';

@Injectable({ providedIn: 'root' })
export class PendudukResolve implements Resolve<IPenduduk> {
  constructor(private service: PendudukService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): IPenduduk | Observable<IPenduduk> {
    const useTemplate = '';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cif: HttpResponse<Penduduk>) => {
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
        map((res: HttpResponse<IPenduduk>) => res.body),
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
    const newItem = new Penduduk();
    return of(newItem);
  }
}

export const pendudukRoute: Routes = [
  {
    path: '',
    component: PendudukComponent,
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
  {
    path: 'creatependuduk',
    component: PendudukCreateComponent,
    resolve: {
      content: PendudukResolve,
    },
  },
  {
    path: ':id',
    component: PendudukUpdateComponent,
    // resolve: {
    //   penduduk: PendudukResolve,
    // },
  },
];
