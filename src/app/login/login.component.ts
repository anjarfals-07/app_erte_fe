import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api'; // Import service untuk menampilkan pesan

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService // Inject MessageService
  ) {}

  login(): void {
    // Validasi jika username atau password kosong
    if (!this.username.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Username harus diisi',
      });
      return;
    }
    if (!this.password.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Password harus diisi',
      });
      return;
    }

    this.authService.login(this.username, this.password).subscribe(
      (isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/dashboard']);
        } else {
          // Jika respons dari backend tidak mengembalikan isLoggedIn true,
          // maka login gagal karena error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal melakukan login',
          });
        }
      },
      (error) => {
        // Tangani kesalahan respons dari backend
        if (error.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Username atau password salah',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Terjadi kesalahan saat melakukan login',
          });
        }
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
