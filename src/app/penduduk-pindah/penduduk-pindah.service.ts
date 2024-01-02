import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AbstractEntityService } from '../shared/base/abstract-entity.service';
import { createRequestOption } from '../shared/util/request-util';
import {
  IKartuKeluarga,
  KartuKeluarga,
} from '../kartu-keluarga/kartukeluarga.model';
import { IPendudukPindah } from './penduduk-pindah.model';
import { IDetailPendudukPindah } from './detail-penduduk-pindah/detail-penduduk-pindah.model';

@Injectable({
  providedIn: 'root',
})
export class PendudukPindahService extends AbstractEntityService<IPendudukPindah> {
  private apiUrl = `${environment.apiUrl}/app/penduduk-pindah`;
  private apiUrlNew = `${environment.apiUrl}/app/detail-pindah`;

  constructor(protected override http: HttpClient) {
    super(http);
    this.resourceUrl = this.apiUrl;
    this.resourceUrlNew = this.apiUrlNew;
  }
  protected override isNew(entity: IPendudukPindah): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getAll(params: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size)
      .set('sort', params.sort);

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  public searchPendudukPindah(
    keyword: string,
    page: number,
    size: number,
    sort: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getById(id: number): Observable<IPendudukPindah> {
    return this.http.get<IPendudukPindah>(`${this.resourceUrl}/${id}`);
  }
  // getPendudukByNoKK(noKK: string): Observable<IDetailPendudukPindah[]> {
  //   const url = `${this.apiUrl}/get-penduduk-by-no-kk`;
  //   const params = { noKK }; // Pass the parameter as an object

  //   return this.http.get<IDetailPendudukPindah[]>(url, { params });
  // }

  public getAllDetail(params: any): Observable<any> {
    const url = `${this.resourceUrlNew}`;
    const httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size)
      .set('sort', params.sort);

    return this.http.get<any>(url, { params: httpParams });
  }

  public getByKodePindah(kodePindah: string): Observable<any> {
    const url = `${this.resourceUrlNew}`;
    const params = { kodePindah }; // Pass the parameter as an object
    return this.http.get<any>(url, { params });
  }

  public deletePendudukPindah(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(`${url}`, { responseType: 'text' });
  }
}
