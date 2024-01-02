import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../util/request-util';

@Injectable({ providedIn: 'root' })
export class AbstractEntityService<T> {
  protected lastReadCache: Date;
  protected cacheSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  protected cacheTTL: number;

  caches$: Observable<T[]> = this.cacheSubject.asObservable();

  protected resourceUrl: string;
  protected resourceUrlNew: string;
  protected resourceUrlCash: string;
  protected resourceSearchUrl: string;
  protected resourceCurrency: string;
  protected resourceRetrive: string;
  protected resourceSyncHobis: string;
  protected resourcelistCurrency: string;
  protected resouceGridRetrive: string;
  protected resourceLovUrl: string;
  protected resourceUrlBrance: string;
  protected loanAnalysisPath: string;
  protected resourceFacility: string;
  protected insuranceInformationUrl: string;
  protected cashPositionResource: string;

  constructor(protected http?: HttpClient) {
    this.lastReadCache = new Date();
    this.cacheTTL = 0;
  }

  protected isNew(entity: T): boolean {
    return false;
  }

  protected preSave(entity: T) {}

  protected convertDateFromServer(res: HttpResponse<T>): HttpResponse<T> {
    return res;
  }

  protected convertDateArrayFromServer(
    res: HttpResponse<T[]>
  ): HttpResponse<T[]> {
    return res;
  }

  protected itemPreLoad(item: T): T {
    return item;
  }

  protected preLoadItem(res: HttpResponse<T>): HttpResponse<T> {
    this.itemPreLoad(res.body);
    return res;
  }

  protected preLoadItemArray(res: HttpResponse<T[]>): HttpResponse<T[]> {
    if (res.body && Array.isArray(res.body)) {
      res.body.forEach((item) => {
        this.itemPreLoad(item);
      });
    }
    return res;
  }

  create(entity: T, params?: any): Observable<HttpResponse<T>> {
    this.preSave(entity);
    const options = createRequestOption(params);
    return this.http
      .post<T>(this.resourceUrl, entity, {
        observe: 'response',
        params: options,
      })
      .pipe(map((res: HttpResponse<T>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<T>) => this.preLoadItem(res)));
  }

  saveAll(entities: T[], params?: any): Observable<HttpResponse<T[]>> {
    entities.forEach((entity) => {
      this.preSave(entity);
    });
    const options = createRequestOption(params);
    return this.http
      .post<T[]>(`${this.resourceUrl}/save-all`, entities, {
        observe: 'response',
        params: options,
      })
      .pipe(
        map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res))
      );
  }

  update(entity: T, id: any, params?: any): Observable<HttpResponse<T>> {
    this.preSave(entity);
    const options = createRequestOption(params);
    return this.http
      .put<T>(`${this.resourceUrl}/${id}`, entity, {
        observe: 'response',
        params: options,
      })
      .pipe(map((res: HttpResponse<T>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<T>) => this.preLoadItem(res)));
  }

  save(entity: T, params?: any): Observable<HttpResponse<T>> {
    if (this.isNew(entity)) {
      return this.create(entity, params);
    }
    return this.update(entity, params);
  }

  find(id: any): Observable<HttpResponse<T>> {
    return this.http
      .get<T>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<T>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<T>) => this.preLoadItem(res)));
  }

  query(req?: any): Observable<HttpResponse<T[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<T[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(
        map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res))
      )
      .pipe(map((res: HttpResponse<T[]>) => this.preLoadItemArray(res)));
  }

  queryNew(req?: any): Observable<HttpResponse<T[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<T[]>(this.resourceUrlNew, { params: options, observe: 'response' })
      .pipe(
        map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res))
      )
      .pipe(map((res: HttpResponse<T[]>) => this.preLoadItemArray(res)));
  }

  queryDynamicURL(req?: any, url?: string): Observable<HttpResponse<T[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<T[]>(url, { params: options, observe: 'response' })
      .pipe(
        map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res))
      )
      .pipe(map((res: HttpResponse<T[]>) => this.preLoadItemArray(res)));
  }

  delete(id: any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
      observe: 'response',
      responseType: 'text' as 'json',
    });
  }

  search(req?: any): Observable<HttpResponse<T[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<T[]>(this.resourceSearchUrl, {
        params: options,
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res))
      )
      .pipe(map((res: HttpResponse<T[]>) => this.preLoadItemArray(res)));
  }

  queryFilterBy(req?: any): Observable<HttpResponse<T[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<T[]>(this.resourceUrl + '/filterBy', {
        params: options,
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res))
      )
      .pipe(map((res: HttpResponse<T[]>) => this.preLoadItemArray(res)));
  }

  cashQueryFilterBy(req?: any): Observable<HttpResponse<T[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<T[]>(this.resourceUrlCash + '/filterBy', {
        params: options,
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res))
      )
      .pipe(map((res: HttpResponse<T[]>) => this.preLoadItemArray(res)));
  }

  queryFilterByNew(req?: any): Observable<HttpResponse<T[]>> {
    // const options = createRequestOption(req);
    return this.http
      .get<T[]>(this.resourceUrl + '/filterBy', {
        params: req,
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res))
      )
      .pipe(map((res: HttpResponse<T[]>) => this.preLoadItemArray(res)));
  }

  process(maps?: any, req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.post<any>(`${this.resourceUrl}/process`, maps, {
      params: options,
      observe: 'response',
    });
  }

  changeStatus(entity: T): Observable<HttpResponse<T>> {
    return this.process(entity, { processName: 'changeEntityStatus' });
  }

  cancelEntity(entity: T): Observable<HttpResponse<T>> {
    return this.process(entity, { processName: 'cancelEntity' });
  }

  template(id: any): Observable<HttpResponse<T>> {
    return this.http
      .get<T>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<T>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<T>) => this.preLoadItem(res)));
  }

  loadCacheAll(): Observable<T[]> {
    const minutes: number =
      (new Date().valueOf() - this.lastReadCache.valueOf()) / 1000 / 60;
    if (
      (this.caches$ && minutes < this.cacheTTL) ||
      (this.cacheTTL === 0 && this.cacheSubject.getValue().length > 0)
    ) {
      return of(this.cacheSubject.getValue());
    }
    this.lastReadCache = new Date();
    return this.query({ size: 9999 }).pipe(
      map((res) => res.body),
      tap((res) => this.cacheSubject.next(res))
    );
  }

  uploadFile(
    fileName?: FormData,
    microservice?: string,
    paramHeaders?: HttpHeaders
  ) {
    const url = microservice
      ? `/${microservice}/api/uploadFile`
      : `/api/uploadFile`;
    return this.http.post<any>(url, fileName, {
      headers: paramHeaders,
      observe: 'response',
    });
  }

  downloadFile(
    fileName?: string,
    microservice?: string,
    paramHeaders?: HttpHeaders
  ) {
    const url = microservice
      ? `/${microservice}/api/downloadFile/${fileName}`
      : `/api/downloadFile/${fileName}`;
    return this.http.get(url, {
      responseType: 'blob',
      headers: paramHeaders,
      observe: 'response',
    });
  }

  // getTasks(id: any): Observable<HttpResponse<IProcessTask[]>> {
  //   return this.http.get<IProcessTask[]>(
  //     `${this.resourceUrl}/process-task/${id}`,
  //     { observe: 'response' }
  //   );
  // }

  // processTask(task: IProcessTask): Observable<HttpResponse<ITaskResult>> {
  //   return this.http.post<ITaskResult>(
  //     `${this.resourceUrl}/process-task`,
  //     task,
  //     { observe: 'response' }
  //   );
  // }

  public setValue(item: any, id: string, value?: any) {
    if (!item) {
      item = {};
    }
    if (item[id] === undefined) {
      item[id] = null;
      if (value !== undefined) {
        item[id] = value;
      }
    }
    return item[id];
  }
}
