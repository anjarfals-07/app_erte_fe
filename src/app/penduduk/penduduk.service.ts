import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { IPenduduk, Penduduk } from './penduduk.model';
import { environment } from 'src/environments/environment';
import { AbstractEntityService } from 'src/app/shared/base/abstract-entity.service';
import { createRequestOption } from 'src/app/shared/util/request-util';

@Injectable({
  providedIn: 'root',
})
export class PendudukService extends AbstractEntityService<IPenduduk> {
  private apiUrl = `${environment.apiUrl}/app/penduduk`;

  constructor(protected override http: HttpClient) {
    super(http);
    this.resourceUrl = this.apiUrl;
  }
  protected override isNew(entity: IPenduduk): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getAll(params: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size)
      .set('sort', params.sort);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    console.log('headers', headers);
    return this.http.get<any>(this.resourceUrl, {
      params: httpParams,
      headers: headers,
    });
  }

  createPenduduk(
    entity: IPenduduk,
    params?: any
  ): Observable<HttpResponse<IPenduduk>> {
    this.preSave(entity);
    const formData: FormData = new FormData();

    for (const [key, value] of Object.entries(entity)) {
      if (value !== undefined && value !== null) {
        if (key === 'foto' && value instanceof File) {
          formData.append('foto', value, value.name);
        } else if (key === 'kartuKeluarga') {
          for (const [subKey, subValue] of Object.entries(value)) {
            formData.append(`kartuKeluarga.${subKey}`, subValue as string);
          }
        } else {
          formData.append(key, value);
        }
      }
    }

    const options = createRequestOption(params);

    return this.http
      .post<IPenduduk>(this.resourceUrl, formData, {
        observe: 'response',
        // headers: httpOptions.headers,
        params: options,
      })
      .pipe(
        map((res: HttpResponse<IPenduduk>) => this.convertDateFromServer(res)),
        map((res: HttpResponse<IPenduduk>) => this.preLoadItem(res))
      );
  }

  getById(id: number): Observable<IPenduduk> {
    return this.http.get<IPenduduk>(`${this.resourceUrl}/${id}`);
  }

  updatePenduduk(
    id: number,
    penduduk: IPenduduk,
    params?: any
  ): Observable<HttpResponse<IPenduduk>> {
    this.preSave(penduduk);
    const formData: FormData = new FormData();
    for (const [key, value] of Object.entries(penduduk)) {
      if (value !== undefined && value !== null) {
        if (key === 'foto' && value instanceof File) {
          formData.append('foto', value, value.name);
        } else if (key === 'kartuKeluarga') {
          for (const [subKey, subValue] of Object.entries(value)) {
            formData.append(`kartuKeluarga.${subKey}`, subValue as string);
          }
        } else {
          formData.append(key, value);
        }
      }
    }

    const options = createRequestOption(params);
    return this.http
      .post<IPenduduk>(`${this.resourceUrl}/${id}`, formData, {
        observe: 'response',
        // headers: httpOptions.headers,
        params: options,
      })
      .pipe(
        map((res: HttpResponse<IPenduduk>) => this.convertDateFromServer(res)),
        map((res: HttpResponse<IPenduduk>) => this.preLoadItem(res))
      );
  }

  deletePenduduk(id: number): Observable<any> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  getPendudukByNoKK(noKK: string): Observable<IPenduduk> {
    const url = `${this.resourceUrl}/get-penduduk-by-no-kk`;
    const params = new HttpParams().set('noKK', noKK); // Ensure the parameter is set correctly
    return this.http.get<IPenduduk>(url, { params });
  }

  public searchPenduduk(
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
  getPendudukByNoKtp(noKtp: string): Observable<IPenduduk[]> {
    const url = `${this.apiUrl}/get-penduduk-by-noktp`;
    const params = { noKtp };

    return this.http.get<IPenduduk[]>(url, { params });
  }

  checkNoKtpAvailability(noKtp: string): Observable<boolean> {
    const url = `${this.apiUrl}/check-ktp/${noKtp}`;
    return this.http.get<boolean>(url);
  }
}
