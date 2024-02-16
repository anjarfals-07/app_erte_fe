import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AbstractEntityService } from 'src/app/shared/base/abstract-entity.service';
import { IDetailPendudukPindah } from './detail-penduduk-pindah.model';

@Injectable({
  providedIn: 'root',
})
export class DetailPendudukPindahService extends AbstractEntityService<IDetailPendudukPindah> {
  private apiUrl = `${environment.apiUrl}/app/detail-pindah`;

  constructor(protected override http: HttpClient) {
    super(http);
    this.resourceUrl = this.apiUrl;
  }
  protected override isNew(entity: IDetailPendudukPindah): boolean {
    return entity.id === undefined || entity.id === null;
  }
  // getPendudukByNoKK(noKK: string): Observable<IPenduduk> {
  //   const url = `${this.resourceUrl}/get-penduduk-by-no-kk`;
  //   const params = new HttpParams().set('noKK', noKK); // Ensure the parameter is set correctly
  //   return this.http.get<IPenduduk>(url, { params });
  // }

  createDetailPindah(
    detailPindah: IDetailPendudukPindah
  ): Observable<IDetailPendudukPindah> {
    const url = `${this.resourceUrl}`; // Update the URL accordingly
    return this.http.post<IDetailPendudukPindah>(url, detailPindah);
  }

  // DetailPendudukPindahService

  deleteDetailPindah(detailPindahId: number): Observable<any> {
    const url = `${this.apiUrl}/${detailPindahId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}
