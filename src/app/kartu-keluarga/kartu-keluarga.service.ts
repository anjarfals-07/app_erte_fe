import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { IKartuKeluarga, KartuKeluarga } from './kartukeluarga.model';
import { AbstractEntityService } from 'src/app/shared/base/abstract-entity.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KartuKeluargaService extends AbstractEntityService<IKartuKeluarga> {
  private apiUrl = `${environment.apiUrl}/app/kartu-keluarga`;
  // private apiUrlNew = `${environment.apiUrl}/app/detail-pindah`;

  constructor(protected override http: HttpClient) {
    super(http);
    this.resourceUrl = this.apiUrl;
    // this.resourceUrlNew = this.apiUrlNew;
  }
  protected override isNew(entity: IKartuKeluarga): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getAll(params: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size)
      .set('sort', params.sort);

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  public searchKartuKeluarga(
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
}
