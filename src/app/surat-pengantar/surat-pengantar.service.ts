import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { ISuratPengantar } from './surat-pengantar.model';
import { AbstractEntityService } from 'src/app/shared/base/abstract-entity.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuratPengantarService extends AbstractEntityService<ISuratPengantar> {
  private apiUrl = `${environment.apiUrl}/surat-pengantar`;
  // private apiUrlNew = `${environment.apiUrl}/app/detail-pindah`;

  constructor(protected override http: HttpClient) {
    super(http);
    this.resourceUrl = this.apiUrl;
    // this.resourceUrlNew = this.apiUrlNew;
  }
  protected override isNew(entity: ISuratPengantar): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getAll(params: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size)
      .set('sort', params.sort);

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  public searchSuratPengantar(
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

  getById(id: number): Observable<ISuratPengantar> {
    return this.http.get<ISuratPengantar>(`${this.resourceUrl}/${id}`);
  }
}
