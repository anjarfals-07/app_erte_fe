import { Injectable } from '@angular/core';
import { IUser } from '../user/user.model';
import { AbstractEntityService } from '../shared/base/abstract-entity.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService extends AbstractEntityService<IUser> {
  private apiUrl = `${environment.apiUrl}/app/register`;
  constructor(protected override http: HttpClient) {
    super(http);
    this.resourceUrl = this.apiUrl;
  }

  checkUsernameAvailability(username: string): Observable<boolean> {
    const url = `${this.apiUrl}/check-username/${username}`;
    return this.http.get<boolean>(url);
  }

  checkPendudukRegistered(pendudukId: number): Observable<boolean> {
    const url = `${this.apiUrl}/check-penduduk/${pendudukId}`;
    return this.http.get<boolean>(url);
  }
}
