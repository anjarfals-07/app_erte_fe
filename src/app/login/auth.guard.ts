// import { Injectable } from '@angular/core';
// import {
//   CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   Router,
// } from '@angular/router';
// import { Observable, map, take } from 'rxjs';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | boolean {
//     const storedUser = this.authService.getStoredAuthData();

//     if (storedUser) {
//       this.authService.isLoggedInSubject.next(true);
//       this.authService.loggedInUserSubject.next(storedUser);

//       return true;
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const storedUser = this.authService.getStoredAuthData();

    if (storedUser && this.authService.isTokenValid()) {
      // Menambahkan pemeriksaan token
      this.authService.isLoggedInSubject.next(true);
      this.authService.loggedInUserSubject.next(storedUser);
      return true;
    } else {
      // Token tidak valid atau tidak ada, arahkan kembali ke halaman login
      this.router.navigate(['/login']);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Silahkan Login Terlebih Dahulu',
      });
      return false;
    }
  }
}
