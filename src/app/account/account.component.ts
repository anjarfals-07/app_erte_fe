import { Component } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { Account } from './account.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  account: Account;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.loggedInUser$.subscribe((user) => {
      this.account = user;
    });

    this.authService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  logout() {
    this.authService.logout();
  }
}
