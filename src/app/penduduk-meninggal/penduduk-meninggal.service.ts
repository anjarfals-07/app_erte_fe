import { Injectable } from '@angular/core';
import { IPendudukMeninggal } from './penduduk-meninggal.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AbstractEntityService } from 'src/app/shared/base/abstract-entity.service';

@Injectable({
  providedIn: 'root',
})
export class PendudukMeninggalService extends AbstractEntityService<IPendudukMeninggal> {
  private apiUrl = `${environment.apiUrl}/app/penduduk-meninggal`;
  // private apiUrlNew = `${environment.apiUrl}/app/detail-pindah`;

  constructor(protected override http: HttpClient) {
    super(http);
    this.resourceUrl = this.apiUrl;
  }
  protected override isNew(entity: IPendudukMeninggal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getAll(params: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size)
      .set('sort', params.sort);

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }
  public searchPendudukMeninggal(
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
