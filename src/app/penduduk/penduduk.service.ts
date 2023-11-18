import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AbstractEntityService } from '../shared/base/abstract-entity.service';
import { createRequestOption } from '../shared/util/request-util';
import { IPenduduk } from './penduduk.model';

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
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
      params: options,
    };

    return this.http
      .post<IPenduduk>(this.resourceUrl, formData, {
        observe: 'response',
        headers: httpOptions.headers,
        params: options,
      })
      .pipe(
        map((res: HttpResponse<IPenduduk>) => this.convertDateFromServer(res)),
        map((res: HttpResponse<IPenduduk>) => this.preLoadItem(res))
      );
  }
}
