import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../confirm-dialog/logout-dialog.component';
import { Account } from '../account/account.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  loggedInUserSubject: BehaviorSubject<Account> = new BehaviorSubject<Account>(
    null
  );
  loggedInUser$: Observable<Account> = this.loggedInUserSubject.asObservable();

  isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/app/auth`;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<Account> {
    const loginData = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<Account>(`${this.apiUrl}/login`, loginData, { headers: headers })
      .pipe(
        tap((user: Account) => {
          if (user.token) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            this.isLoggedInSubject.next(true);
            this.loggedInUserSubject.next(user);
          }
        })
      );
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoadingSubject.next(true);

        // Simulate logout process (you should replace this with your actual logout logic)
        setTimeout(() => {
          this.clearSection();
        }, 1000); // Simulating a delay of 1 seconds
      }
    });
  }

  public clearSection(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    this.isLoggedInSubject.next(false);
    this.loggedInUserSubject.next(null);
    this.isLoadingSubject.next(false);
    this.router.navigate(['/login']);
  }

  getStoredAuthData(): Account | null {
    const storedUser = localStorage.getItem('loggedInUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  notifyUserLoggedIn() {
    this.isLoggedInSubject.next(true);
  }
}
